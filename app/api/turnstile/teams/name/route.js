import { db } from '@/lib/firebase/admin';

export async function POST(req) {
    try {
        const body = await req.json();
        const { teamName } = body;

        if (teamName.trim().length === 0) {
            return new Response(JSON.stringify({ message: 'Team name cannot be empty.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (teamName.trim().length > 30) {
            return new Response(JSON.stringify({ message: 'Team name cannot be longer than 30 characters.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const nameQuerySnap = await db.collection('teams').where('name', '==', teamName.trim()).get();
        return new Response(JSON.stringify({ exists: !nameQuerySnap.empty }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 401,
        });
    }
}