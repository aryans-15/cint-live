import { db } from '@/lib/firebase/admin';


export async function GET(req) {
    try {
        let scoreboard = {
            combined: [],
            beginner: [],
            advanced: [],
        }

        const snapshot = await db.collection('teams').get();
        const teamPromises = snapshot.docs.map(async doc => {
            const data = doc.data();
            let division = "beginner";
            let totalPoints = 0;
            let seenProblems = [];
            const members = data.members;
            for (let i = 0; i < members.length; i++) {
                const memberRef = members[i];
                const member = await memberRef.get();
                if (member.exists) {
                    const solved = member.get("solved") || [];
                    for (const challenge of solved) {
                        if (!seenProblems.includes(challenge.problem_id)) {
                            seenProblems.push(challenge.problem_id);
                            totalPoints += challenge.points;
                        }
                    }
                    if (member.get("division") === "advanced") {
                        division = "advanced";
                    }
                }
            }
            scoreboard[division].push({
                name: data.name,
                totalPoints: totalPoints,
            });
            scoreboard["combined"].push({
                name: data.name,
                totalPoints: totalPoints,
                division: division,
            });
        });

        await Promise.all(teamPromises);
        scoreboard.beginner.sort((a, b) => b.totalPoints - a.totalPoints);
        scoreboard.advanced.sort((a, b) => b.totalPoints - a.totalPoints);
        scoreboard.combined.sort((a, b) => b.totalPoints - a.totalPoints);

        return new Response(JSON.stringify(scoreboard), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (err) {
        console.error('Error fetching scoreboard:', err);
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 500,
        });
    }
}