'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { renderMarkdownWithLatex } from '@/utils/renderMarkdown';
import { toast } from 'react-toastify';
import Loader from "@/app/components/loader";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

export default function ChallengeDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [loading, setLoading] = useState(true);


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
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`https://cint-live-backend.onrender.com/problems/${id}`);
        const data = await res.json();
        setChallenge(data);
        setLoading(false);
      } catch (err) {
        console.error('failed to fetch info:', err);
      }
    };

    fetchChallenge();
  }, [id]);

  const extensions = {
    python: python(),
    cpp: cpp(),
    java: java()
  };

  const submitCode = async () => {
    const user = auth.currentUser;
    const token = await user.getIdToken();

    const toastID = toast.loading('Submitting code...');
    setSubmitting(true);
    setResults([]);
    try {
      const res = await fetch('/api/turnstile/challenge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          problem_id: id,
          idToken: token
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.update(toastID, {
          render: data.message || 'Submission failed. Please try again.',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
          closeButton: true
        });
        setSubmitting(false);
        return;
      }

      setResults(data.results);
      let finalVerdict;

      if (data.results.length === 0) {
        finalVerdict = 'No Results Yet';
      } else if (data.results.some(r => r.verdict === 'Runtime Error')) {
        finalVerdict = 'Runtime Error';
      } else if (data.results.some(r => r.verdict === 'Time Limit Exceeded')) {
        finalVerdict = 'Time Limit Exceeded';
      } else if (data.results.some(r => r.verdict === 'Wrong Answer')) {
        finalVerdict = 'Wrong Answer';
      } else if (data.results.every(r => r.verdict === 'Accepted')) {
        finalVerdict = 'Accepted';
      } else {
        finalVerdict = 'Unknown Error';
      }

      toast.update(toastID, {
        render: finalVerdict,
        type: finalVerdict === 'Accepted' ? 'success' : 'error',
        isLoading: false,
        autoClose: 10000,
        closeButton: true
      });
    } catch (err) {
      console.error('submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!challenge) return <Loader />

  return (
    <div className="w-full h-full flex flex-col">
      {(loading || !teamLoaded) ? (
        <Loader />
      ) : (
        <div className="p-6 text-white font-mono grid grid-cols-2 gap-6 h-full w-full">
          <div className="bg-gray-800 p-4 rounded">
            <h1 className="text-2xl font-bold">{challenge.name}</h1>
            <p className="mt-2 text-sm text-gray-400">
              Points: {challenge.points} | Time Limit: {challenge.time_limit}s | Memory Limit: {challenge.memory_limit}MB
            </p>
            <div
              className="mt-4 prose prose-invert max-w-none overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}
              dangerouslySetInnerHTML={{ __html: renderMarkdownWithLatex(challenge.flavor_text) }}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-lg">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 p-2 rounded border border-gray-500"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="bg-gray-900 rounded">
              <CodeMirror
                value={code}
                height="400px"
                theme={oneDark}
                extensions={[extensions[language]]}
                onChange={(val) => setCode(val)}
              />
            </div>
            <button
              onClick={submitCode}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-bold"
            >
              {submitting ? 'Submitting...' : 'Submit Code'}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
/*
{results.length > 0 && (
          <div className="bg-gray-800 p-4 rounded mt-4">
            <h2 className="text-xl font-bold mb-2">Verdict</h2>
            <p className="text-lg text-yellow-300">{getFinalVerdict()}</p>
          </div>
        )}
          */
