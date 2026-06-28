import { getPool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const role = req.cookies.get('user_role')?.value;
        if (role !== 'admin')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const pool = await getPool();
        const check = await pool.request()
            .input('id', parseInt(params.id))
            .query('SELECT id FROM alerts WHERE id = @id');

        if (check.recordset.length === 0)
            return NextResponse.json({ error: 'Alert not found' }, { status: 404 });

        await pool.request()
            .input('id', parseInt(params.id))
            .query('DELETE FROM alerts WHERE id = @id');

        return NextResponse.json({ message: 'Alert deleted' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
