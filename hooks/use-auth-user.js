import { useEffect, useState } from 'react';
import { onAuthStateChanged } from '@/libs/firebase/auth';

export function useAuthUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
        });

        return () => unsubscribe(); 
    }, []);

    return user; 
}
