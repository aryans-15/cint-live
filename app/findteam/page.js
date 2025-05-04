"use client"

import { useState, useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "@/app/components/loader";


export default function FindTeam() {
  const router = useRouter();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [path, setPath] = useState("");
  const [divisionModalOpen, setDivisionModalOpen] = useState(false);
  const [teamCode, setTeamCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [division, setDivision] = useState("");

  function clear() {
    setJoinModalOpen(false);
    setCreateModalOpen(false);
    setConsentModalOpen(false);
    setDivisionModalOpen(false);
    setTeamCode("");
    setTeamName("");
    setDivision("");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const teamRef = userDoc.data()?.team;
      if (!teamRef) {
        setTeamLoaded(true);
        return;
      }

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
        idToken: token,
        division: division
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

    const toastID = toast.loading("Joining team...");

    const token = await user.getIdToken();
    var response = await fetch("/api/turnstile/teams/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamCode: teamCode,
        idToken: token,
        division: division
      }),
    });
    if (response.status === 200) {
      toast.update(toastID, {
        render: "Successfully joined team!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
      router.push("/myteam");
    } else {
      const data = await response.json();
      toast.update(toastID, {
        render: data.message || "Failed to join team. Please try again later.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
    }
  }

  async function verify() {
    if ((teamCode.trim().length !== 6)) {
      toast.error("Team code must be exactly 6 characters long.");
      setTeamCode("");
      return;
    }

    const response = await fetch("/api/turnstile/teams/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamCode: teamCode }),
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data.exists) {
        setJoinModalOpen(false);
        setDivisionModalOpen(true);
      } else {
        toast.error("Team code is invalid. Did type it correctly?");
        setTeamCode("");
      }
    } else {
      toast.error(data.message || "Failed to join team. Please try again later.");
      setTeamCode("");
    }
  }

  async function checkTeamName() {
    if (teamName.trim().length === 0) {
      toast.error("Team name cannot be empty.");
      return;
    }
    if (teamName.trim().length > 30) {
      toast.error("Team name cannot be longer than 30 characters.");
      return;
    }

    const response = await fetch("/api/turnstile/teams/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName: teamName }),
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data.exists) {
        toast.error("Team name is already taken. Please choose another one.");
        setTeamName("");
      } else {
        setCreateModalOpen(false);
        setDivisionModalOpen(true);
      }
    } else {
      toast.error(data.message || "Failed to check team name. Please try again later.");
    }
  }


  return (
    <div className="flex flex-col h-full w-full font-mono">
      {!teamLoaded ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-full w-full relative">
          <div className="flex flex-col items-center justify-center h-full w-full ">
            <p className="text-5xl font-bold mb-4">CInT is better with friends!</p>
            <p className="text-lg">Join or create a team in order to compete.</p>
            <div className="flex flex-row p-4 gap-4 text-lg">
              <button onClick={() => { setJoinModalOpen(true); setPath("join") }} className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">Join a Team</button>
              <button onClick={() => { setCreateModalOpen(true); setPath("create") }} className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">Create a Team</button>
            </div>
          </div>
          {joinModalOpen && (
            <div onClick={() => clear()} className="animate-fadeIn fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
              <div onClick={(e) => e.stopPropagation()} className="z-50 flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-8 shadow-xl">
                <p className="text-4xl font-bold">Join a Team</p>
                <p className="text-sm pt-2">Ask your team for this!</p>
                <div className="flex flex-row items-center justify-center pt-4 gap-2">
                  <p className="text-2xl">Enter team code: </p>
                  <input value={teamCode} onChange={(e) => setTeamCode(e.target.value)} type="text" className="p-2 rounded-lg grow text-black" placeholder="Ex: abc123" />
                </div>
                <div className="flex flex-row items-center justify-center pt-4 gap-2">
                  <button onClick={() => clear()} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
                  <button onClick={() => { verify() }} className={`bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${teamCode.trim().length === 6 ? "" : "opacity-50 pointer-events-none"}`}>Join Team</button>
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
                  <button onClick={() => { checkTeamName() }} className={`bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${teamName.trim().length > 0 && teamName.trim().length <= 30 ? "" : "opacity-50 pointer-events-none"}`}>Create Team</button>
                </div>
              </div>
            </div>
          )}
          {divisionModalOpen && (
            <div onClick={() => clear()} className="animate-fadeIn fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
              <div onClick={(e) => e.stopPropagation()} className="z-50 flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-8 shadow-xl max-w-xl w-full mx-4">
                <p className="text-4xl font-bold text-white">Select Division</p>
                <p className="text-sm pt-2 text-white text-center">Please select the division you want to compete in.</p>
                <div className="flex flex-row justify-center items-center pt-4 gap-4 w-full h-32">
                  <div
                    style={division === "beginner" ? {
                      borderWidth: "3px",
                      borderColor: "oklch(79.2% 0.209 151.711)"
                    } : {}}
                    className="flex flex-col h-full justify-center bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded transition duration-300 cursor-pointer w-full text-center"
                    onClick={() => setDivision("beginner")}
                  >
                    <p className="text-2xl font-bold">Beginner</p>
                    <p className="text-sm pt-1">Select if you're new</p>
                  </div>
                  <div
                    style={division === "advanced" ? {
                      borderWidth: "3px",
                      borderColor: "oklch(79.2% 0.209 151.711)"
                    } : {}}
                    className="flex flex-col h-full justify-center bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded transition duration-300 cursor-pointer w-full text-center"
                    onClick={() => setDivision("advanced")}
                  >
                    <p className="text-2xl font-bold">Advanced</p>
                    <p className="text-sm pt-1">Select if you're experienced</p>
                  </div>

                </div>
                <div className="flex flex-row items-center justify-center pt-6 gap-4">
                  <button onClick={() => { setDivisionModalOpen(false); {path == "join" ? setJoinModalOpen(true) : setCreateModalOpen(true)}} } className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300">Back</button>
                  <button onClick={() => { setDivisionModalOpen(false); setConsentModalOpen(true); }} className={`bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${division ? "" : "opacity-50 pointer-events-none"}`}>Next</button>
                </div>
              </div>
            </div>
          )}
          {consentModalOpen && (
            <div onClick={() => clear()} className="animate-fadeIn fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
              <div onClick={(e) => e.stopPropagation()} className="z-50 flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-8 shadow-xl max-w-xl w-full mx-4">
                <p className="text-4xl font-bold text-white">Rules</p>
                <p className="text-sm pt-2 text-white text-center">You must agree to the competition rules to participate.</p>
                <ol className="list-decimal text-left text-white break-words w-full pt-4 space-y-2 px-4">
                  <li>I will not use AI tools including but not limited to ChatGPT, Claude and DeepSeek.</li>
                  <li>I will not help or ask for help from (this includes hints, "nudges" in the right direction, etc...) other competitors or outside sources.</li>
                  <li>I acknowledge that judges reserve the final call in any disputes.</li>
                  <li>I understand that breaking these rules will result in disqualification for me and my teammates.</li>
                </ol>
                <div className="flex flex-row items-center justify-center pt-6 gap-4">
                  <button onClick={() => { setConsentModalOpen(false); setDivisionModalOpen(true) }} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300">Back</button>
                  <button onClick={() => { path == "join" ? joinTeam() : createTeam(); clear() }} className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">I Agree</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
