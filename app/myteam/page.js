'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import Loader from "@/app/components/loader";
import stc from 'string-to-color';
import { toast } from 'react-toastify';

export default function TeamInfo() {
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [members, setMembers] = useState([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [teamDivision, setTeamDivision] = useState("beginner");
  const [teamScore, setTeamScore] = useState(0);
  const [teamChallenges, setTeamChallenges] = useState([]);
  const [teamIndex, setTeamIndex] = useState(0);

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, (word) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }

  function minifyNum(num) {
    if (num < 1000) {
      return num;
    } else {
      return (num / 1000).toFixed(1) + 'k';
    }

  }

  function pluralize(num) {
    if (num == 1) return "";
    return "s";
  }

  function cardinality(num) {
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return `${num}th`;
  }

  function medalColor(place) {
    if (place == 1) return "oklch(79.5% 0.184 86.047)";
    if (place == 2) return "oklch(70.7% 0.022 261.325)";
    if (place == 3) return "oklch(40.8% 0.123 38.172)";
  }

  function getContrastColor(hex) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? 'oklch(27.8% 0.033 256.848)' : 'oklch(92.8% 0.006 264.531)';
  }


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
      if (teamDoc.exists()) {
        setTeam(teamDoc.data());
        for (let i = 0; i < 3; i++) {
          if (teamDoc.data().names[i]) {
            setMembers((prev) => [...prev, teamDoc.data().names[i]]);
          } else {
            setMembers((prev) => [...prev, undefined]);
          }
        }

        const jerry = teamDoc.data().members;
        const names = teamDoc.data().names;
        let updatedChallenges = [];

        for (let i = 0; i < jerry.length; i++) {
          const jerrypediatrics = jerry[i];
          const name = names[i];

          const jerrypediatricsSnap = await getDoc(jerrypediatrics);

          if (jerrypediatricsSnap.exists()) {
            const solved = jerrypediatricsSnap.get("solved") || [];

            for (const challenge of solved) {
              const existing = updatedChallenges.find(c => c.problem_id === challenge.problem_id);
              if (!existing) {
                updatedChallenges.push({ ...challenge, solvedBy: name });
                setTeamScore(prev => prev + challenge.points);
              } else {
                if (new Date(challenge.timeSolved) < new Date(existing.timeSolved)) {
                  existing.solvedBy = name;
                  existing.timeSolved = challenge.timeSolved;
                }
              }
            }

            if (jerrypediatricsSnap.get("division") === "advanced") {
              setTeamDivision("advanced");
            }
          }
        } 
        console.log(updatedChallenges)
        setTeamChallenges(updatedChallenges);
        const scoreboardRes = await fetch('/api/turnstile/teams/scoreboard')
        if (scoreboardRes.status === 403) {
          setTeamIndex("?");
          setTeamLoaded(true);
        } else {
          const scoreboardData = await scoreboardRes.json();
          setTeamIndex(scoreboardData[teamDivision].findIndex(t => t.name === teamDoc.data().name) + 1);
          setTeamLoaded(true);
        }
      } else {
        router.push("/findteam");
      }
    });

    return () => unsubscribe();
  }, [router]);


  function TeamDetails({ team }) {
    return (
      <div className="flex flex-col h-full w-full relative">
        <div className="flex flex-row h-full w-full p-4 items-center gap-4">
          <div className="flex flex-col h-full w-1/4 justify-start">
            <div className="flex text-2xl font-bold bg-gray-600 rounded p-3 justify-center">
              <p className="truncate">{team.name}</p>
            </div>
            <div style={teamDivision === "beginner" && { backgroundColor: "oklch(58.8% 0.158 241.966)", } || teamDivision === "advanced" && { backgroundColor: "oklch(58.6% 0.253 17.585)", }} onClick={() => router.push("/scoreboard")} className="flex flex-col items-center text-xl bg-rose-600 rounded p-3 justify-center mt-2 pointer-cursor hover:bg-rose-700 transition duration-300 cursor-pointer">
              <p className="truncate">{toTitleCase(teamDivision)}</p>
              <p className="truncate">{minifyNum(teamScore)} points - <span style={{ color: medalColor(teamIndex) }}>{cardinality(teamIndex)}</span></p>
            </div>
            <div className="flex flex-col h-full bg-gray-600 rounded mt-2">
              <div className="text-xl font-bold white bg-gray-700 p-2 text-center rounded-t">
                Team Members
              </div>
              <div className="flex-1 p-4 flex flex-col gap-4">
                {members.map((member, index) => (
                  member != undefined ? (
                    <div key={index} className="flex h-1/3 p-4 w-full rounded justify-center items-center" style={{ backgroundColor: stc(member), color: getContrastColor(stc(member)) }}>
                      <p className="font-bold text-xl truncate">{member}</p>
                    </div>
                  ) : (
                    <div key={index} onClick={() => setInviteModalOpen(true)} className="flex h-1/3 p-4 w-full rounded justify-center items-center bg-gray-700 cursor-pointer hover:bg-gray-800 transition duration-300">
                      <p className="font-bold text-2xl">+</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full w-3/4 justify-start bg-gray-600 rounded">
            <div className="text-xl font-bold white bg-gray-700 p-2 text-center rounded-t">
              Challenges
            </div>
            <div className="flex flex-col h-full overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="flex sticky top-0 flex-row py-2 shadow pl-8 pr-8 w-full rounded-b justify-start items-center bg-gray-600 ">
                <p className="font-bold text-xl w-1/3 truncate">Name</p>
                <p className="text-lg w-1/3 truncate">Points</p>
                <p className="text-lg w-1/3 truncate">Solved By</p>
              </div>
              <div className="flex flex-col p-4 gap-4 overflow-auto h-full">
                {teamScore == 0 ? (
                  <div className="flex flex-col items-center justify-center h-full w-full ">
                    <p className="text-2xl">No challenges solved (yet)</p>
                    <p className="text-lg">Go solve your first one <a href="/challenges">here</a>!</p>
                  </div>

                ) : (
                  teamChallenges.map((challenge, index) => (
                    <div onClick={() => router.push("/challenges/" + challenge.problem_id)} key={index} className="flex flex-row p-4 w-full rounded justify-start items-center bg-gray-500 hover:bg-gray-800 transition duration-300 cursor-pointer">
                      <p className="font-bold text-xl w-1/3 truncate">{challenge.name}</p>
                      <p className="text-lg w-1/3 truncate">{challenge.points} point{pluralize(challenge.points)}</p>
                      <p className="text-lg w-1/3 truncate" style={{ color: stc(challenge.solvedBy) }} >{challenge.solvedBy}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div >
        {inviteModalOpen && (
          <div onClick={() => setInviteModalOpen(false)} className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center animate-fadeIn">
            <div onClick={(e) => e.stopPropagation()} className="z-50 flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-8 shadow-xl">
              <p className="text-4xl font-bold">Invite Teammate{pluralize(3 - team.names.length)}</p>
              <p className="text-sm pt-2">Team slots left: {3 - team.names.length}/3</p>
              <div className="flex flex-col items-center justify-center pt-4 gap-2">
                <p className="text-2xl">Your Invite Code:</p>
                <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded">
                  <code className="font-mono text-xl">{team.code}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(team.code);
                      toast.success("Copied to clipboard!");
                    }}
                    className="ml-2 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded text-white transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center pt-4 gap-2">
                <button onClick={() => setInviteModalOpen(false)} className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">Done!</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full font-mono">
      {!teamLoaded ? (
        <Loader />
      ) : (
        <TeamDetails team={team} />
      )}
    </div>
  );
}