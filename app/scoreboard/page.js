"use client";

function getFakeTeams(prefix) {
  const names = [
    "Team 1", "Team 2", "Team 3", "Team 4", "Team 5",
    "Team 6", "Team 7", "Team 8", "Team 9", "Team 10"
  ];

  return names.map((name, i) => ({
    name: `${prefix} ${name}`,
    points: Math.floor(Math.random() * 20000),
  }));
}

const beginnerTeams = getFakeTeams("");
const advancedTeams = getFakeTeams("");

function TeamBoard({ title, teams }) {
  return (
    <div className="flex-1 p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-3 text-gray-300 font-bold text-sm border-b border-gray-700 pb-2 mb-2">
        <div className="text-left">Place</div>
        <div className="text-left ml-1">Team</div>
        <div className="text-right mr-4">Points</div>
      </div>

      {teams
        .sort((a, b) => b.points - a.points)
        .map((team, index) => {
          const place = index + 1;

          const placeColor = place == 1
              ? "bg-yellow-500 text-black"
              : place == 2
              ? "bg-gray-400 text-black"
              : place == 3
              ? "bg-amber-700 text-white"
              : index % 2 == 0 ? "bg-gray-800" : "bg-gray-700";

          return (
            <div
              key={index}
              className={`grid grid-cols-3 items-center p-3 rounded-lg mb-2 transition duration-200 ${placeColor}`}
            >
              <div className="font-bold text-lg">{place}</div>
              <div>{team.name}</div>
              <div className="text-right font-bold text-lg">{team.points}</div>
            </div>
          );
        })}
    </div>
  );
}

export default function Scoreboard() {
  return (
    <div className="max-w-8xl mx-auto mt-10 px-6 font-mono text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        <TeamBoard title="Beginner Division" teams={beginnerTeams} />
        <TeamBoard title="Advanced Division" teams={advancedTeams} />
      </div>
    </div>
  );
}
