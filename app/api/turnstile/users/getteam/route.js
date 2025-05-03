import { auth as adminAuth, db } from '@/lib/firebase/admin';

export async function GET(req) {
    try {
        const body = await req.json();
        const { idToken } = body;

        const decoded = await adminAuth.verifyIdToken(idToken);
        const uid = decoded.uid;

        const userRef = db.collection('users').doc(uid).get();
        const userTeam = userRef.data()?.team || null;

        // No team (this should not happen)
        if (!userTeam) {
            return new Response(JSON.stringify({}), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            const teamSnap = await db.collection('teams').doc(userTeam.id).get();

            // Team does not exist (this should not happen either)
            if (!teamSnap.exists) {
                return new Response(JSON.stringify({message: 'The requested team was not found.'}), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            const teamData = teamSnap.data();
            return new Response(JSON.stringify(teamData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (err) {
        console.error('Error registering user:', err);
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 401,
        });
    }
}