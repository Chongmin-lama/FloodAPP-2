import { getPool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const role = req.cookies.get('user_role')?.value;
        const pool = await getPool();

        // public and citizens see active alerts only; authority/admin see all
        const filter = (role === 'authority' || role === 'admin') ? '' : "WHERE a.status = 'active'";

        const result = await pool.request().query(`
            SELECT a.id AS alertId, a.title, a.district, a.area, a.severity,
                   a.description, a.status, a.created_at,
                   u.name AS authorityName
            FROM flood_alerts a
            LEFT JOIN users u ON a.created_by = u.id
            ${filter}
            ORDER BY a.created_at DESC
        `);
        return NextResponse.json({ alerts: result.recordset });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const role = req.cookies.get('user_role')?.value;
        const userId = req.cookies.get('user_id')?.value;

        if (role !== 'authority' && role !== 'admin')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const { title, district, area, severity, message } = await req.json();

        if (!title || !severity || !message)
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });

        const pool = await getPool();
        await pool.request()
            .input('title', title)
            .input('district', district || null)
            .input('area', area || null)
            .input('severity', severity)
            .input('message', message)
            .input('created_by', parseInt(userId!))
            .query(`INSERT INTO flood_alerts (title, district, area, severity, description, status, created_by)
                    VALUES (@title, @district, @area, @severity, @message, 'active', @created_by)`);

        return NextResponse.json({ message: 'Alert published' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
