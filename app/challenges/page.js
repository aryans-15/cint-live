'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [verdicts, setVerdicts] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch('https://cint-live-backend.onrender.com/problems');
        const data = await res.json();
        setChallenges(data);
      } catch (err) {
        console.error("failed to fetch:", err);
      }
    };

    //tbd
    const fetchVerdicts = () => {};
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
      <div className="text-xl font-bold bg-gray-700 p-2 text-center rounded-t">
        Challenges
      </div>

      <div className="flex sticky top-0 flex-row py-2 shadow pl-8 pr-8 w-full rounded-b justify-start items-center bg-gray-600">
        <p className="font-bold text-xl w-1/4 truncate">Name</p>
        <p className="text-lg w-1/4 truncate">Points</p>
        <p className="text-lg w-1/4 truncate">Time Limit</p>
        <p className="text-lg w-1/4 truncate">Memory Limit</p>
      </div>

      <div className="flex flex-col py-4 gap-4 overflow-auto h-full">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => router.push(`/challenges/${challenge.id}`)}
            className={`flex flex-row p-4 w-full rounded justify-start items-center cursor-pointer hover:opacity-90 transition duration-300 ${verdictColor(verdicts[challenge.id])}`}
          >
            <p className="font-bold text-xl w-1/4 truncate">{challenge.name}</p>
            <p className="text-lg w-1/4 truncate">{challenge.points}</p>
            <p className="text-lg w-1/4 truncate">{challenge.time_limit} sec</p>
            <p className="text-lg w-1/4 truncate">{challenge.memory_limit} MB</p>
          </div>
        ))}
      </div>
    </div>
  );
}
