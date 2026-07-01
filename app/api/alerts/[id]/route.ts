import { getPool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// PUT - edit alert fields
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const role = req.cookies.get('user_role')?.value;
        if (role !== 'authority' && role !== 'admin')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const { title, district, area, severity, message } = await req.json();
        if (!title || !severity || !message)
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });

        const pool = await getPool();
        const check = await pool.request()
            .input('id', parseInt(params.id))
            .query('SELECT id FROM flood_alerts WHERE id = @id');

        if (check.recordset.length === 0)
            return NextResponse.json({ error: 'Alert not found' }, { status: 404 });

        await pool.request()
            .input('id', parseInt(params.id))
            .input('title', title)
            .input('district', district || null)
            .input('area', area || null)
            .input('severity', severity)
            .input('message', message)
            .query(`UPDATE flood_alerts SET
                title       = @title,
                district    = @district,
                area        = @area,
                severity    = @severity,
                description = @message
                WHERE id = @id`);

        return NextResponse.json({ message: 'Alert updated' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH - toggle status between active and inactive
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const role = req.cookies.get('user_role')?.value;
        if (role !== 'authority' && role !== 'admin')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const pool = await getPool();
        const result = await pool.request()
            .input('id', parseInt(params.id))
            .query('SELECT status FROM flood_alerts WHERE id = @id');

        if (result.recordset.length === 0)
            return NextResponse.json({ error: 'Alert not found' }, { status: 404 });

        const current = result.recordset[0].status;
        const newStatus = current === 'active' ? 'inactive' : 'active';

        await pool.request()
            .input('id', parseInt(params.id))
            .input('status', newStatus)
            .query('UPDATE flood_alerts SET status = @status WHERE id = @id');

        return NextResponse.json({ message: `Alert set to ${newStatus}`, status: newStatus });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const role = req.cookies.get('user_role')?.value;
        if (role !== 'authority' && role !== 'admin')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const pool = await getPool();
        const check = await pool.request()
            .input('id', parseInt(params.id))
            .query('SELECT id FROM flood_alerts WHERE id = @id');

        if (check.recordset.length === 0)
            return NextResponse.json({ error: 'Alert not found' }, { status: 404 });

        await pool.request()
            .input('id', parseInt(params.id))
            .query('DELETE FROM flood_alerts WHERE id = @id');

        return NextResponse.json({ message: 'Alert deleted' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
