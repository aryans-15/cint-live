'use client'

import Loader from '@/app/components/loader';
import { act, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Scoreboard() {
  const [loading, setLoading] = useState(true);
  const [scoreboard, setScoreboard] = useState({ combined: [], beginner: [], advanced: [] });
  const [activeTab, setActiveTab] = useState('combined');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    async function fetchScoreboard() {
      try {
        const response = await fetch('/api/turnstile/teams/scoreboard');
        if (response.status === 403) {
          setScoreboard({
            combined: [
              {
                "name": "Never gonna give you up",
                "totalPoints": 1000,
                "division": "advanced"
              },
              {
                "name": "Never gonna let you down",
                "totalPoints": 900,
                "division": "beginner"
              },
              {
                "name": "Never gonna run around and desert you",
                "totalPoints": 800,
                "division": "advanced"
              },
              {
                "name": "Never gonna make you cry",
                "totalPoints": 700,
                "division": "beginner"
              },
              {
                "name": "Never gonna say goodbye",
                "totalPoints": 600,
                "division": "advanced"
              },
              {
                "name": "Never gonna tell a lie and hurt you",
                "totalPoints": 500,
                "division": "beginner"
              }
            ], beginner: [
              {
                "name": "Never gonna give you up",
                "totalPoints": 1000,
                "division": "advanced"
              },
              {
                "name": "Never gonna let you down",
                "totalPoints": 900,
                "division": "beginner"
              },
              {
                "name": "Never gonna run around and desert you",
                "totalPoints": 800,
                "division": "advanced"
              },
              {
                "name": "Never gonna make you cry",
                "totalPoints": 700,
                "division": "beginner"
              },
              {
                "name": "Never gonna say goodbye",
                "totalPoints": 600,
                "division": "advanced"
              },
              {
                "name": "Never gonna tell a lie and hurt you",
                "totalPoints": 500,
                "division": "beginner"
              }
            ], advanced: [
              {
                "name": "Never gonna give you up",
                "totalPoints": 1000,
                "division": "advanced"
              },
              {
                "name": "Never gonna let you down",
                "totalPoints": 900,
                "division": "beginner"
              },
              {
                "name": "Never gonna run around and desert you",
                "totalPoints": 800,
                "division": "advanced"
              },
              {
                "name": "Never gonna make you cry",
                "totalPoints": 700,
                "division": "beginner"
              },
              {
                "name": "Never gonna say goodbye",
                "totalPoints": 600,
                "division": "advanced"
              },
              {
                "name": "Never gonna tell a lie and hurt you",
                "totalPoints": 500,
                "division": "beginner"
              }
            ]
          });
          setVisible(false);
        } else {
          const data = await response.json();
          setScoreboard(data);
        }
      } catch (error) {
        toast.error('Failed to fetch scoreboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchScoreboard();
  }, []);

  function pluralize(num) {
    if (num == 1) return "";
    return "s";
  }

  function medalColor(place) {
    if (place == 1) return "oklch(79.5% 0.184 86.047)";
    if (place == 2) return "oklch(70.7% 0.022 261.325)";
    if (place == 3) return "oklch(40.8% 0.123 38.172)";
  }

  return (
    <div className="flex flex-col w-full h-full p-4 font-mono">
      <div className="flex items-center justify-center h-full">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <div className={`${!visible ? "blur pointer-events-none" : ""} flex flex-col w-full h-full rounded bg-gray-600`}>
              <div className="flex flex-row w-full text-2xl font-bold text-white rounded-t overflow-hidden shadow">
                <div
                  onClick={() => setActiveTab('combined')}
                  className={`flex w-1/3 items-center justify-center p-4 cursor-pointer transition duration-300 ${activeTab === 'combined' ? 'bg-emerald-400 hover:bg-emerald-600' : 'bg-gray-700 hover:bg-emerald-400'
                    }`}
                >
                  <p>Combined</p>
                </div>
                <div
                  onClick={() => setActiveTab('beginner')}
                  className={`flex w-1/3 items-center justify-center p-4 cursor-pointer transition duration-300 ${activeTab === 'beginner' ? 'bg-sky-400 hover:bg-sky-600' : 'bg-gray-700 hover:bg-sky-400'
                    }`}
                >
                  <p>Beginner</p>
                </div>
                <div
                  onClick={() => setActiveTab('advanced')}
                  className={` flex w-1/3 items-center justify-center p-4 cursor-pointer transition duration-300 ${activeTab === 'advanced' ? 'bg-rose-400 hover:bg-rose-600' : 'bg-gray-700 hover:bg-rose-400'
                    }`}
                >
                  <p>Advanced</p>
                </div>
              </div>
              <div style={{ maxHeight: 'calc(100vh - 200px)' }} className="flex flex-col h-full overflow-auto">
                <div className="flex sticky top-0 flex-row py-2 shadow pl-8 pr-12 w-full rounded-b justify-start items-center bg-gray-600">
                  <p className="font-bold text-xl w-1/4 truncate">#</p>
                  <p className="text-lg w-1/2 truncate">Name</p>
                  <p className="text-lg w-1/4 truncate">Points</p>
                  {
                    activeTab === 'combined' && (
                      <p className="text-lg w-1/4 truncate">
                        Division
                      </p>
                    )
                  }
                </div>
                <div className="flex flex-col p-4 gap-4 overflow-auto h-full">
                  {
                    (() => {
                      let currentRank = 1;
                      let lastPoints = null;

                      return scoreboard[activeTab].map((team, index) => {
                        const isTie = team.totalPoints === lastPoints;
                        if (!isTie) currentRank = index + 1;

                        lastPoints = team.totalPoints;

                        return (
                          <div
                            key={index}
                            style={{ backgroundColor: medalColor(currentRank) }}
                            className="flex flex-row p-4 w-full rounded justify-start items-center bg-gray-500 hover:bg-gray-800 transition duration-300 cursor-pointer"
                          >
                            <p className="font-bold text-xl w-1/4 truncate">{currentRank}</p>
                            <p className="text-lg w-1/2 truncate">{team.name}</p>
                            <p className="text-lg w-1/4 truncate">
                              {team.totalPoints} point{pluralize(team.totalPoints)}
                            </p>
                            {
                              activeTab === 'combined' && (
                                <p className="text-lg w-1/4 truncate">
                                  {team.division.charAt(0).toUpperCase() + team.division.slice(1)}
                                </p>
                              )
                            }
                          </div>
                        );
                      });
                    })()
                  }
                </div>
              </div>
            </div>
            {
              !visible && (
                <div className="fixed inset-0 z-40 w-full h-full flex justify-center items-center">
                  <div className="bg-gray-800 bg-opacity-75 p-6 rounded-lg text-center">
                    <p className="text-2xl font-bold">The leaderboard is currently hidden.</p>
                  </div>
                </div>
              )
            }
          </div>
        )}
      </div >
    </div >
  );
}
