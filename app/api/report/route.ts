import { getPool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const userId = req.cookies.get('user_id')?.value;
        const role = req.cookies.get('user_role')?.value;
        if (!userId || !role) {
            return NextResponse.json(
                { error: 'Not logged in' },
                { status: 401 }
            );
        }


        const pool = await getPool();

        let result;

        if (role === 'admin' || role === 'authority') {
            result = await pool.request().query(`
                SELECT *
                FROM reports
                ORDER BY created_at DESC
            `);
        } else {
            result = await pool.request()
                .input('user_id', userId)
                .query(`
                    SELECT *
                    FROM reports
                    WHERE user_id = @user_id
                    ORDER BY created_at DESC
                `);
        }


        return NextResponse.json(result.recordset);

    } catch (err: any) {
        console.error(err);

        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = req.cookies.get('user_id')?.value;
        const { district, location, severity, description, waterLevel, contactNumber } = await req.json();

        if (!location || !description)
            return NextResponse.json({ error: 'Location and description required' }, { status: 400 });

        const pool = await getPool();
        await pool.request()
            .input('user_id', userId || null)
            .input('location', location)
            .input('description', description)
            .input('severity', severity || 'medium')
            .input('district', district || null)
            .input('contactNumber', contactNumber || null)
            .input('waterLevel', waterLevel || null)
            .query(`INSERT INTO reports 
        (user_id, location, description, severity, status, District, ContactNumber, WaterLevel)
        VALUES (@user_id, @location, @description, @severity, 'pending', @district, @contactNumber, @waterLevel)`);

        return NextResponse.json({ message: 'Report submitted' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

