// utils/auth.js
import { signInWithGoogle, signOutWithGoogle } from '@/libs/firebase/auth';
import { createSession, removeSession } from '@/actions/auth-actions';

export const handleSignIn = async () => {
    const uid = await signInWithGoogle();
    if (uid) {
        await createSession(uid);
    }
};

export const handleSignOut = async () => {
    await signOutWithGoogle();
    await removeSession();
};
