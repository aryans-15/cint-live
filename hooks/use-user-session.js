import { useEffect, useState } from 'react';

import { onAuthStateChanged } from '../lib/firebase/auth';

export function useUserSession(InitSession) {
  const [userUid, setUserUid] = useState(InitSession);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUserUid(authUser?.uid);
      } else {
        setUserUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return userUid;
}