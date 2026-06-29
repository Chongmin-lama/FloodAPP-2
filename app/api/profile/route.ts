import { getPool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// GET - fetch own profile
export async function GET(req: NextRequest) {
    try {
        const userId = req.cookies.get('user_id')?.value;
        if (!userId) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

        const pool = await getPool();
        const result = await pool.request()
            .input('id', parseInt(userId))
            .query('SELECT id, name, email, role, created_at FROM users WHERE id = @id');

        if (result.recordset.length === 0)
            return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json(result.recordset[0]);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT - update name, email, and/or password
export async function PUT(req: NextRequest) {
    try {
        const userId = req.cookies.get('user_id')?.value;
        if (!userId) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

        const { name, email, currentPassword, newPassword } = await req.json();

        if (!name || !email)
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });

        const pool = await getPool();

        // Check email not taken by someone else
        const emailCheck = await pool.request()
            .input('email', email)
            .input('id', parseInt(userId))
            .query('SELECT id FROM users WHERE email = @email AND id != @id');

        if (emailCheck.recordset.length > 0)
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

        // If changing password, verify current one first
        if (newPassword) {
            if (!currentPassword)
                return NextResponse.json({ error: 'Current password required' }, { status: 400 });

            const userResult = await pool.request()
                .input('id', parseInt(userId))
                .query('SELECT password FROM users WHERE id = @id');

            const match = await bcrypt.compare(currentPassword, userResult.recordset[0].password);
            if (!match)
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });

            const hashed = await bcrypt.hash(newPassword, 10);
            await pool.request()
                .input('id', parseInt(userId))
                .input('name', name)
                .input('email', email)
                .input('password', hashed)
                .query('UPDATE users SET name = @name, email = @email, password = @password WHERE id = @id');
        } else {
            await pool.request()
                .input('id', parseInt(userId))
                .input('name', name)
                .input('email', email)
                .query('UPDATE users SET name = @name, email = @email WHERE id = @id');
        }

        // Update name cookie
        const response = NextResponse.json({ message: 'Profile updated' });
        response.cookies.set('user_name', name, { httpOnly: true, path: '/' });
        return response;

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
