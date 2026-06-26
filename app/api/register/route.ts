import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password)
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });

        const pool = await getPool();

        // Check if email already exists
        const existing = await pool.request()
            .input('email', email)
            .query('SELECT id FROM users WHERE email = @email');

        if (existing.recordset.length > 0)
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

        // Hash password and insert
        const hashed = await bcrypt.hash(password, 10);

        await pool.request()
            .input('name', name)
            .input('email', email)
            .input('password', hashed)
            .query('INSERT INTO users (name, email, password, role) VALUES (@name, @email, @password, \'citizen\')');

        return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });

    } catch (err: any) {
        console.error('Register error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}