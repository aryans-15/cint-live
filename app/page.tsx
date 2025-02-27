"use client"

import { useState, useEffect } from "react";
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  });
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 py-6 bg-gray-800 rounded-xl font-mono">
      <p className="w-full text-center text-8xl text-gray-100 font-bold mb-2">CInT 2025</p>
      {isMounted && (
        <p className="w-full text-center text-6xl text-gray-100">{time}</p>
      )}
    </div>
  );
}
