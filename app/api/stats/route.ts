import { getPool } from '@/lib/db';
import { NextResponse } from 'next/server';

// Public endpoint — returns aggregate counts only, no sensitive data
export async function GET() {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT
                COUNT(*)                                            AS total,
                SUM(CASE WHEN status = 'pending'    THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'resolved'   THEN 1 ELSE 0 END) AS resolved
            FROM reports
        `);

        const alertResult = await pool.request().query(`
            SELECT COUNT(*) AS total FROM flood_alerts
        `);

        const row = result.recordset[0];

        return NextResponse.json({
            total:    row.total    ?? 0,
            pending:  row.pending  ?? 0,
            resolved: row.resolved ?? 0,
            alerts:   alertResult.recordset[0].total ?? 0,
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
