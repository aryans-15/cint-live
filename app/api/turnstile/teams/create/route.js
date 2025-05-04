import { auth as adminAuth, db } from '@/lib/firebase/admin';

function generateTeamCode() {
    const chars = 'qwertyuiopasdfghjklzxcvbnm1234567890';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { idToken, teamName, division } = body;

        const decoded = await adminAuth.verifyIdToken(idToken);
        const creator = db.collection('users').doc(decoded.uid);

        if (teamName.trim().length === 0) {
            return new Response(JSON.stringify({ message: 'Team name cannot be empty.' }), {
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

        if (teamName.trim().length > 30) {
            return new Response(JSON.stringify({ message: 'Team name cannot be longer than 30 characters.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userSnap = await db.collection('teams').where('members', 'array-contains', creator).get();
        if (!userSnap.empty) {
            return new Response(JSON.stringify({ message: 'You are already in a team.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const nameQuerySnap = await db.collection('teams').where('name', '==', teamName.trim()).get();
        if (!nameQuerySnap.empty) {
            return new Response(JSON.stringify({ message: 'Team name is taken.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let code;
        let exists = true;

        while (exists) {
            code = generateTeamCode();
            const teamSnap = await db.collection('teams').doc(code).get();
            exists = teamSnap.exists;
        }

        await db.collection('teams').doc(code).set({
            name: teamName.trim(),
            code,
            members: [creator],
            names: [decoded.name || 'Anonymous'],
            captain: creator,
            markedForNegation: false,
            points: Math.round(Math.random() * 9999),
            solved: []
        });


        await creator.update({ division, team: db.collection('teams').doc(code) });

        return new Response(null, { status: 200 });
    } catch (err) {
        console.error('Error creating team:', err);
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
