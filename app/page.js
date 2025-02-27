"use client"

import { useState, useEffect } from "react";
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [countdownWeeks, setCountdownWeeks] = useState(0);
  const [countdownDays, setCountdownDays] = useState(0);
  const [countdownHours, setCountdownHours] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  function cardinal(num) {
    if (num == 1) {
      return "";
    } else {
      return "s";
    }
  }
  function countdown() {
    const now = new Date();
    const event = new Date('2025-04-01T08:00:00-05:00');
    let diff = Math.floor((event - now) / 1000);

    setCountdownWeeks(Math.floor(diff / (7 * 24 * 60 * 60)));
    diff %= (7 * 24 * 60 * 60);

    setCountdownDays(Math.floor(diff / (24 * 60 * 60)));
    diff %= (24 * 60 * 60);

    setCountdownHours(Math.floor(diff / (60 * 60)));
    diff %= (60 * 60);

    setCountdownMinutes(Math.floor(diff / 60));
    setCountdownSeconds(diff % 60);
  }
  useEffect(() => {
    setIsMounted(true);
    countdown();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      countdown();
    }, 1000);
  });
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 py-6 bg-gray-800 rounded-xl font-mono gap-10">
      <p className="w-full text-center text-8xl text-gray-100 font-bold mb-2">CInT 2025</p>
      {isMounted && (
        <div className="flex flex-col text-4xl text-gray-100">
          <p className="w-full"><span className="font-bold text-blue-400">{countdownWeeks}</span> Week{cardinal(countdownWeeks)}</p>
          <p className="w-full"><span className="font-bold text-blue-400">{countdownDays}</span> Day{cardinal(countdownDays)}</p>
          <p className="w-full"><span className="font-bold text-blue-400">{countdownHours}</span> Hour{cardinal(countdownHours)}</p>
          <p className="w-full"><span className="font-bold text-blue-400">{countdownMinutes}</span> Minute{cardinal(countdownMinutes)}</p>
          <p className="w-full"><span className="font-bold text-blue-400">{countdownSeconds}</span> Second{cardinal(countdownSeconds)}</p>
        </div>
      )}
      {!isMounted && (
        <p className="w-full text-center text-4xl text-gray-100">Loading...</p>
      )}
    </div>
  );
}