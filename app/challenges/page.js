'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/loader';
import { auth, db } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [verdicts, setVerdicts] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const teamRef = userDoc.data()?.team;
      if (!teamRef) {
        router.push("/findteam");
        return;
      }

      const teamDoc = await getDoc(teamRef);
      if (!teamDoc.exists()) {
        router.push("/findteam");
      }

      const game = await getDoc(doc(db, 'admin', 'JELfi8JXl6KtmJ7kbmYe'));
      const gameData = game.data();
      if (Date.now() < gameData.unlockdate.toDate()) {
        toast.error('The competition has not started yet.');
        router.push('/');
      } else if (Date.now() > gameData.lockdate.toDate()) {
        toast.error('The competition has ended. Thank you for playing!');
        router.push('/');
      } else {
        setTeamLoaded(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch('https://cint-live-backend.onrender.com/problems');
        const data = await res.json();
        setChallenges(data);
        setLoading(false);
      } catch (err) {
        console.error("failed to fetch:", err);
      }
    };

    //tbd
    const fetchVerdicts = () => { };
    fetchChallenges();
    fetchVerdicts();
  }, []);

  const verdictColor = (verdict) => {
    switch (verdict) {
      case 'AC': return 'bg-green-600';
      case 'RTE': return 'bg-yellow-500';
      case 'WA':
      case 'TLE': return 'bg-red-500';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 font-mono">
      {(loading || !teamLoaded) ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-full w-full p-4 font-mono">
          <div className="text-xl font-bold bg-gray-700 p-2 text-center rounded-t">
            Challenges
          </div>

          <div className="flex sticky top-0 flex-row py-2 shadow px-4 w-full rounded-b justify-start items-center bg-gray-600">
            <p className="font-bold text-xl w-1/2 truncate">Name</p>
            <p className="text-lg w-1/6 truncate">Points</p>
            <p className="text-lg w-1/6 truncate">Time Limit</p>
            <p className="text-lg w-1/6 truncate">Memory Limit</p>
          </div>

          <div className="flex flex-col py-4 gap-4 overflow-auto h-full">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => router.push(`/challenges/${challenge.id}`)}
                className={`flex flex-row p-4 w-full rounded justify-start items-center cursor-pointer hover:opacity-90 transition duration-300 ${verdictColor(verdicts[challenge.id])}`}
              >
                <p className="font-bold text-xl w-1/2 truncate">{challenge.name}</p>
                <p className="text-lg w-1/6 truncate">{challenge.points}</p>
                <p className="text-lg w-1/6 truncate">{challenge.time_limit} sec</p>
                <p className="text-lg w-1/6 truncate">{challenge.memory_limit} MB</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
