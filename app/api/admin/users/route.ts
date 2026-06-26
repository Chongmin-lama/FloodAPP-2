import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET - list all users
export async function GET(req: NextRequest) {
    try {
        const role = req.cookies.get('user_role')?.value;
        if (role !== 'admin')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const pool = await getPool();
        const result = await pool.request()
            .query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

        return NextResponse.json(result.recordset);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}