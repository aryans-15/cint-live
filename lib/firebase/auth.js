import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

export function onAuthStateChanged(callback) {
    return _onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        if (!result || !result.user) {
            throw new Error('Google sign in failed');
        }

        const idToken = await result.user.getIdToken();

        await fetch('/api/turnstile/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        return result.user.uid;
    } catch (error) {
        console.error('Error signing in with Google', error);
    }
}

export async function signOutWithGoogle() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out with Google', error);
    }
}
