import { auth as adminAuth, db } from '@/lib/firebase/admin';

export async function POST(req) {
    try {
        const body = await req.json();
        const { idToken } = body;

        const decoded = await adminAuth.verifyIdToken(idToken);
        const uid = decoded.uid;

        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            await userRef.set({
                email: decoded.email,
                team: null,
                markedForNegation: false
            });
        }
        
        return new Response(null, {
            status: 200,
        })
    } catch (err) {
        console.error('Error registering user:', err);
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 401,
        });
    }
}