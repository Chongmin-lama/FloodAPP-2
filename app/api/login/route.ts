import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password)
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

        const pool = await getPool();
        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM users WHERE email = @email');

        const user = result.recordset[0];

        if (!user)
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const response = NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

        response.cookies.set('user_id', String(user.id), { httpOnly: true, path: '/' });
        response.cookies.set('user_role', user.role, { httpOnly: true, path: '/' });
        response.cookies.set('user_name', user.name, { httpOnly: true, path: '/' });

        return response;

    } catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}