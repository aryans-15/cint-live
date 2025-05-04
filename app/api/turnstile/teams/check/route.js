import { db } from '@/lib/firebase/admin';

export async function GET(req) {
    try {
        const body = await req.json();
        const { teamCode } = body;

        const teamSnap = await db.collection('teams').doc(teamCode).get();
        return new Response(JSON.stringify({ exists: teamSnap.exists }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 401,
        });
    }
}