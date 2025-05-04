import { auth as adminAuth, db } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';


export async function POST(req) {
    try {
        const body = await req.json();
        let { idToken, teamCode, division } = body;
        teamCode = teamCode.trim().toLowerCase();

        const decoded = await adminAuth.verifyIdToken(idToken);
        const user = db.collection('users').doc(decoded.uid);

        const userSnap = await db.collection('teams').where('members', 'array-contains', user).get();
        if (!userSnap.empty) {
            return new Response(JSON.stringify({ message: 'You are already in a team.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (division !== 'advanced' && division !== 'beginner') {
            return new Response(JSON.stringify({ message: 'Division is invalid. (You know we can see your ip, right?)' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const teamSnap = await db.collection('teams').doc(teamCode).get();
        if (!teamSnap.exists) {
            return new Response(JSON.stringify({ message: 'Team code is invalid. Did type it correctly?' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const teamData = teamSnap.data();
        if (teamData.members.length >= 3) {
            return new Response(JSON.stringify({ message: 'This team is full already.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await db.collection('teams').doc(teamCode).update({
            members: FieldValue.arrayUnion(user),
            names: FieldValue.arrayUnion(decoded.name || 'Anonymous'),
        });

        await user.update({ division, team: db.collection('teams').doc(teamCode) });

        return new Response(null, { status: 200 });
    } catch (err) {
        console.error('Error creating team:', err);
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
