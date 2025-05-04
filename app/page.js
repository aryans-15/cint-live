"use client"

import { doc, getDoc } from 'firebase/firestore';
import { db } from "@/lib/firebase/config";

import { useState, useEffect } from "react";
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [countdownWeeks, setCountdownWeeks] = useState(0);
  const [countdownDays, setCountdownDays] = useState(0);
  const [countdownHours, setCountdownHours] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [cintTime, setCintTime] = useState("");
  const [currentTarget, setCurrentTarget] = useState(0);
  const [countdownType, setCountdownType] = useState("");

  function cardinal(num) {
    if (num == 1) {
      return "";
    } else {
      return "s";
    }
  }

  function formatDate(date) {
    const day = date.getDate();
    const ordinal = day % 10 == 1 && day != 11 ? "st" : day % 10 == 2 && day != 12 ? "nd" : day % 10 == 3 && day != 13 ? "rd" : "th";
    const month = date.toLocaleDateString(undefined, { month: "long" });
    const year = date.getFullYear();
    const timeStr = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short"
    });
    return `${month} ${day}${ordinal}, ${year}, ${timeStr}`;
  }

  function countdown() {
    const now = new Date();
    const event = new Date(currentTarget);
    let diff = Math.floor((event - now) / 1000);

    setCountdownWeeks(Math.floor(diff / (7 * 24 * 60 * 60)));
    diff %= (7 * 24 * 60 * 60);

    setCountdownDays(Math.floor(diff / (24 * 60 * 60)));
    diff %= (24 * 60 * 60);

    setCountdownHours(Math.floor(diff / (60 * 60)));
    diff %= (60 * 60);

    setCountdownMinutes(Math.floor(diff / 60));
    setCountdownSeconds(diff % 60);
    setCintTime(formatDate(event));
  }

  useEffect(() => {
    async function fetchGameData() {
      const game = await getDoc(doc(db, 'admin', 'JELfi8JXl6KtmJ7kbmYe'));
      const gameData = game.data();
      if (Date.now() < gameData.unlockdate.toDate()) {
        setCurrentTarget(gameData.unlockdate.toDate());
        setCountdownType("starts in");
      } else if (Date.now() > gameData.unlockdate.toDate()) {
        setCurrentTarget(gameData.lockdate.toDate());
        setCountdownType("ends in");
      } else {
        setCountdownType("has ended! Thank you for playing!");
      }
      setIsMounted(true);
    }
    fetchGameData();
  }, []);
  useEffect(() => {
    if (currentTarget) {
      countdown(); 
    }
  }, [currentTarget]);
  useEffect(() => {
    const timer = setTimeout(() => {
      countdown();
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 py-6 bg-gray-800 rounded-xl font-mono gap-2">
      <p className="w-full text-center text-9xl text-gray-100 font-bold">CInT 2025</p>
      {isMounted && (
        <div className="flex flex-col text-4xl text-gray-100 items-center">
          <p className="text-center text-blue-400 font-bold text-4xl">
            {countdownType}
          </p>
          {countdownType !== "has ended! Thank you for playing!" && (
            <p className="mt-2 text-xl text-gray-300">
              {countdownWeeks} Week{cardinal(countdownWeeks)}, {countdownDays} Day{cardinal(countdownDays)}, {countdownHours} Hour{cardinal(countdownHours)}, {countdownMinutes} Minute{cardinal(countdownMinutes)}, {countdownSeconds} Second{cardinal(countdownSeconds)}
            </p>
          )}
        </div>
      )}
      {!isMounted && (
        <p className="w-full text-center text-4xl text-gray-100">Loading...</p>
      )}
    </div>
  );
}