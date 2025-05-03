"use client"

import { useState, useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";


export default function FindTeam() {
  const router = useRouter();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [teamCode, setTeamCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamLoaded, setTeamLoaded] = useState(false);

  function clear() {
    setJoinModalOpen(false);
    setCreateModalOpen(false);
    setTeamCode("");
    setTeamName("");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const teamRef = userDoc.data()?.team;
      if (!teamRef) return;

      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        router.push("/myteam");
      } else {
        setTeamLoaded(true);
      }
    });

    return () => unsubscribe();
  }, [router]);


  async function createTeam() {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to create a team.");
      return;
    }
    if (teamName.trim().length === 0) {
      toast.error("Team name cannot be empty.");
      return;
    }

    const token = await user.getIdToken();
    var response = await fetch("/api/turnstile/teams/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamName: teamName,
        idToken: token
      }),
    });
    if (response.status === 200) {
      toast.success("Team created successfully!");
      router.push("/myteam");
    } else {
      const data = await response.json();
      toast.error(data.message || "Failed to create team. Please try again later.");
    }
  }

  async function joinTeam() {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to join a team.");
      return;
    }
    if (teamCode.trim().length !== 6) {
      toast.error("Team code must be exactly 6 characters long.");
      return;
    }

    const token = await user.getIdToken();
    var response = await fetch("/api/turnstile/teams/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamCode: teamCode,
        idToken: token
      }),
    });
    if (response.status === 200) {
      toast.success("Joined team successfully!");
      router.push("/myteam");
    } else {
      const data = await response.json();
      toast.error(data.message || "Failed to join team. Please try again later.");
    }
  }

  return (
    <div className="flex flex-col h-full w-full font-mono">
      {!teamLoaded ? (
        <div className="flex items-center justify-center h-full w-full font-mono text-4xl animate-pulse">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col h-full w-full relative">
          <div className="flex flex-col items-center justify-center h-full w-full ">
            <p className="text-5xl font-bold mb-4">CInT is better with friends!</p>
            <p className="text-lg">Join or create a team in order to compete.</p>
            <div className="flex flex-row p-4 gap-4 text-lg">
              <button onClick={() => setJoinModalOpen(true)} className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">Join a Team</button>
              <button onClick={() => setCreateModalOpen(true)} className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">Create a Team</button>
            </div>
          </div>
          {joinModalOpen && (
            <div onClick={() => clear()} className="animate-fadeIn fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
              <div onClick={(e) => e.stopPropagation()} className="z-50 flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-8 shadow-xl">
                <p className="text-4xl font-bold">Join a Team</p>
                <p className="text-sm pt-2">Ask your team leader for this!</p>
                <div className="flex flex-row items-center justify-center pt-4 gap-2">
                  <p className="text-2xl">Enter team code: </p>
                  <input value={teamCode} onChange={(e) => setTeamCode(e.target.value)} type="text" className="p-2 rounded-lg grow text-black" placeholder="Ex: abc123" />
                </div>
                <div className="flex flex-row items-center justify-center pt-4 gap-2">
                  <button onClick={() => clear()} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
                  <button onClick={() => { joinTeam(); clear() }} className={`bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${teamCode.trim().length === 6 ? "" : "opacity-50 pointer-events-none"}`}>Join Team</button>
                </div>
              </div>
            </div>
          )}
          {createModalOpen && (
            <div onClick={() => clear()} className="animate-fadeIn fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
              <div onClick={(e) => e.stopPropagation()} className="z-50 flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-8 shadow-xl">
                <p className="text-4xl font-bold">Create a Team</p>
                <p className="text-sm pt-4">Make sure your team name is appropriate and respectful.</p>
                <div className="flex flex-row items-center justify-center pt-2 gap-2">
                  <p className="text-2xl">Enter team name: </p>
                  <input value={teamName} onChange={(e) => setTeamName(e.target.value)} type="text" className="p-2 rounded-lg grow text-black" placeholder="Ex: Kyra Fan Club" />
                </div>
                <div className="flex flex-row items-center justify-center pt-4 gap-2">
                  <button onClick={() => clear()} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
                  <button onClick={() => { createTeam(); clear() }} className={`bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${teamName.trim().length > 0 ? "" : "opacity-50 pointer-events-none"}`}>Create Team</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
