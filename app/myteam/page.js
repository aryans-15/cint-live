'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";

export default function TeamInfo() {
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [teamLoaded, setTeamLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const teamRef = userDoc.data()?.team;
      if (!teamRef) return;

      const teamDoc = await getDoc(teamRef);
      if (!teamDoc.exists()) {
        router.push("/findteam");
      } else {
        setTeam(teamDoc.data());
        setTeamLoaded(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  function TeamDetails({ team }) {
    return (
      <div>
        <h1>{team.name}</h1>
        <p>Members: {team.members.length}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full font-mono">
      {!teamLoaded ? (
        <div className="flex items-center justify-center h-full w-full font-mono text-4xl animate-pulse">
          <p>Loading...</p>
        </div>
      ) : (
        <TeamDetails team={team} />
      )}
    </div>
  );
}
