'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { renderMarkdownWithLatex } from '@/utils/renderMarkdown';

export default function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`https://cint-live-backend.onrender.com/problems/${id}`);
        const data = await res.json();
        setChallenge(data);
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
    setSubmitting(true);
    setResults([]);
    try {
      const res = await fetch('https://cint-live-backend.onrender.com/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          problem_id: id
        })
      });

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      console.error('submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getFinalVerdict = () => {
    if (results.some(r => r.verdict === 'RTE')) return 'Runtime Error';
    if (results.some(r => r.verdict === 'TLE')) return 'Time Limit Exceeded';
    if (results.some(r => r.verdict === 'WA')) return 'Wrong Answer';
    if (results.every(r => r.verdict === 'AC')) return 'Accepted';
    return 'RTE'; //something probably went wrong. add better handling later tho
  };

  if (!challenge) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white font-mono grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 p-4 rounded">
        <h1 className="text-2xl font-bold">{challenge.name}</h1>
        <p className="mt-2 text-sm text-gray-400">
          Points: {challenge.points} | Time Limit: {challenge.time_limit}s | Memory Limit: {challenge.memory_limit}MB
        </p>
        <div
          className="mt-4 prose prose-invert max-w-none"
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

        {results.length > 0 && (
          <div className="bg-gray-800 p-4 rounded mt-4">
            <h2 className="text-xl font-bold mb-2">Verdict</h2>
            <p className="text-lg text-yellow-300">{getFinalVerdict()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
