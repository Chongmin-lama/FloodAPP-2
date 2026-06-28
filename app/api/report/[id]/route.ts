import { getPool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// PATCH - authority/admin updates report status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const role = req.cookies.get('user_role')?.value;
        if (role !== 'authority' && role !== 'admin')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const { status } = await req.json();
        const allowed = ['verified', 'responding', 'resolved', 'rejected'];
        if (!allowed.includes(status))
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

        const pool = await getPool();
        const check = await pool.request()
            .input('id', parseInt(params.id))
            .query('SELECT id FROM reports WHERE id = @id');

        if (check.recordset.length === 0)
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });

        await pool.request()
            .input('id', parseInt(params.id))
            .input('status', status)
            .query('UPDATE reports SET status = @status WHERE id = @id');

        return NextResponse.json({ message: 'Status updated' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE - delete a report (only if pending)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = req.cookies.get('user_id')?.value;
        const role = req.cookies.get('user_role')?.value;
        if (!userId)
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

        const pool = await getPool();

        const isPrivileged = role === 'admin' || role === 'authority';

        const check = await pool.request()
            .input('id', parseInt(params.id))
            .input('user_id', parseInt(userId))
            .query(
                isPrivileged
                    ? 'SELECT id, status FROM reports WHERE id = @id'
                    : 'SELECT id, status FROM reports WHERE id = @id AND user_id = @user_id'
            );

        if (check.recordset.length === 0)
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });

        if (check.recordset[0].status !== 'pending')
            return NextResponse.json({ error: 'Can only delete pending reports' }, { status: 403 });

        await pool.request()
            .input('id', parseInt(params.id))
            .query('DELETE FROM reports WHERE id = @id');

        return NextResponse.json({ message: 'Report deleted' });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT - update a report (only if pending)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = req.cookies.get('user_id')?.value;
        const role = req.cookies.get('user_role')?.value;
        if (!userId)
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

        const { location, severity, description, waterLevel, contactNumber, district } = await req.json();

        const pool = await getPool();

        // Admins/authority can edit any report; citizens can only edit their own
        const isPrivileged = role === 'admin' || role === 'authority';

        const check = await pool.request()
            .input('id', parseInt(params.id))
            .input('user_id', parseInt(userId))
            .query(
                isPrivileged
                    ? 'SELECT id, status FROM reports WHERE id = @id'
                    : 'SELECT id, status FROM reports WHERE id = @id AND user_id = @user_id'
            );

        if (check.recordset.length === 0)
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });

        if (check.recordset[0].status !== 'pending')
            return NextResponse.json({ error: 'Can only edit pending reports' }, { status: 403 });

        await pool.request()
            .input('id', parseInt(params.id))
            .input('location', location)
            .input('description', description)
            .input('severity', severity)
            .input('district', district || null)
            .input('contactNumber', contactNumber || null)
            .input('waterLevel', waterLevel || null)
            .query(`UPDATE reports SET 
        location      = @location,
        description   = @description,
        severity      = @severity,
        District      = @district,
        ContactNumber = @contactNumber,
        WaterLevel    = @waterLevel
        WHERE id = @id`);

        return NextResponse.json({ message: 'Report updated' });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}