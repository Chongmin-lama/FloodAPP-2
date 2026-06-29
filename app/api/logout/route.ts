import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set('user_id',   '', { httpOnly: true, path: '/', maxAge: 0 });
    response.cookies.set('user_role', '', { httpOnly: true, path: '/', maxAge: 0 });
    response.cookies.set('user_name', '', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
}
