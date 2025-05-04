import { auth as adminAuth, db } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req) {
    try {
        const body = await req.json();
        const { idToken, language, code, problem_id } = body;

        if (!idToken || !language || !code || !problem_id) {
            return new Response(JSON.stringify({ message: 'Missing required fields.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (['python', 'cpp', 'java'].indexOf(language.toLowerCase()) === -1) {
            return new Response(JSON.stringify({ message: 'Invalid language specified.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const decoded = await adminAuth.verifyIdToken(idToken);
        const user = db.collection('users').doc(decoded.uid);

        const userRef = await user.get();
        const userTeam = userRef.data()?.team || null;

        if (!userTeam) {
            return new Response(JSON.stringify({ message: 'You must be in a team to submit challenges.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const teamSnap = await db.collection('teams').doc(userTeam.id).get();
        if (!teamSnap.exists) {
            return new Response(JSON.stringify({ message: 'You must be in a team to submit challenges.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const gameRef = await db.collection('admin').doc('JELfi8JXl6KtmJ7kbmYe').get();
        const gameData = gameRef.data();

        if (Date.now() < gameData.unlockdate.toDate()) {
            return new Response(JSON.stringify({ message: 'The competition has not started yet.' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (Date.now() > gameData.lockdate.toDate()) {
            return new Response(JSON.stringify({ message: 'The competition has ended. Thank you for playing!' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const checkChall = await fetch(`https://cint-live-backend.onrender.com/problems/${problem_id}`);
        if (checkChall.status !== 200) {
            return new Response(JSON.stringify({ message: 'Invalid problem ID.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const problemData = await checkChall.json();

        if (!problemData?.id || !problemData?.points || !problemData?.name) {
            return new Response(JSON.stringify({ message: 'Incomplete challenge data recieved from judge. Please try again later.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const res = await fetch('https://cint-live-backend.onrender.com/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language,
                code,
                problem_id
            })
        })
        const data = await res.json();
        const verdicts = data.results;

        if (!verdicts || verdicts.length === 0) {
            return new Response(JSON.stringify({ results: verdicts, message: 'Invalid response recieved from judge. Please try again later.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (verdicts.every(r => r.verdict === 'Accepted')) {
            await user.update({
                solved: FieldValue.arrayUnion({
                    problem_id: problemData.id,
                    points: problemData.points,
                    name: problemData.name,
                    timeSolved: new Date().toISOString()
                }),
            });
            return new Response(JSON.stringify({ results: verdicts }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ results: verdicts }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }




    } catch (err) {
        console.error('Error submitting challenge:', err);
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 500,
        });
    }
}