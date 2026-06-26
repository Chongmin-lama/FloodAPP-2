import { getPool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// DELETE - delete a report (only if pending)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = req.cookies.get('user_id')?.value;
        if (!userId)
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

        const pool = await getPool();

        // Make sure report belongs to user and is still pending
        const check = await pool.request()
            .input('id', parseInt(params.id))
            .input('user_id', parseInt(userId))
            .query('SELECT id, status FROM reports WHERE id = @id AND user_id = @user_id');

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
        if (!userId)
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

        const { location, severity, description, waterLevel, contactNumber, district } = await req.json();

        const pool = await getPool();

        // Make sure report belongs to user and is still pending
        const check = await pool.request()
            .input('id', parseInt(params.id))
            .input('user_id', parseInt(userId))
            .query('SELECT id, status FROM reports WHERE id = @id AND user_id = @user_id');

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