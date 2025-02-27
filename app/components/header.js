'use client'

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartSimple, faCode, faArrowRightToBracket, faBars } from "@fortawesome/free-solid-svg-icons";
import { useUserSession } from '@/hooks/use-user-session';
import { signInWithGoogle, signOutWithGoogle } from '@/libs/firebase/auth';
import { createSession, removeSession } from '@/actions/auth-actions';

export default function Header({ session }) {
    const userSessionId = useUserSession(session);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSignIn = async () => {
        const userUid = await signInWithGoogle();
        if (userUid) {
            await createSession(userUid);
        }
    };

    const handleSignOut = async () => {
        await signOutWithGoogle();
        await removeSession();
    };

    const navItems = [
        { icon: faHouse, label: "Home" },
        { icon: faChartSimple, label: "Scoreboard" },
        { icon: faCode, label: "Challenges" }
    ];

    return (
        <div className="flex w-full h-14 px-2 items-center justify-between">
            <div className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-10 ml-2" />
            </div>

            <div className="hidden md:flex grow ml-8">
                {navItems.map((item, index) => (
                    <div key={index} className="relative py-2 px-4 flex items-center text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                        <div className="w-5 flex justify-center">
                            <FontAwesomeIcon icon={item.icon} />
                        </div>
                        <p className="ml-2">{item.label}</p>
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 transition-transform duration-300 ease-in-out hover:scale-x-100"></div>
                    </div>
                ))}
            </div>

            <div className="flex items-center">
                {!userSessionId ? (
                    <div className="hidden md:flex" onClick={handleSignIn}>
                        <div className="py-2 px-4 flex items-center text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                            <div className="w-5 flex justify-center">
                                <FontAwesomeIcon icon={faArrowRightToBracket} className="font-bold" />
                            </div>
                            <p className="ml-2 font-bold">Login</p>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex" onClick={handleSignOut}>
                        <div className="py-2 px-4 flex items-center text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                            <div className="w-5 flex justify-center">
                                <FontAwesomeIcon icon={faArrowRightToBracket} className="font-bold" />
                            </div>
                            <p className="ml-2 font-bold">Logout</p>
                        </div>
                    </div>
                )}

                <div className="md:hidden">
                    <button onClick={() => setIsDrawerOpen(true)} className="text-gray-300">
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                </div>
            </div>

            {isDrawerOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="w-64 bg-gray-800 h-full shadow-lg p-4 transform translate-x-0 animate-slide-in">
                        <div className="flex justify-end">
                            <button className="text-white text-lg" onClick={() => setIsDrawerOpen(false)}>✖</button>
                        </div>
                        <div className="mt-4 flex flex-col space-y-4">
                            {navItems.map((item, index) => (
                                <div key={index} className="flex items-center text-gray-300 cursor-pointer hover:text-blue-400 transition">
                                    <div className="w-6 flex justify-center">
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>
                                    <p className="ml-2">{item.label}</p>
                                </div>
                            ))}
                            {!userSessionId ? (
                                <div onClick={handleSignIn} className="flex items-center text-gray-300 cursor-pointer hover:text-blue-400 transition">
                                    <div className="w-6 flex justify-center">
                                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                                    </div>
                                    <p className="ml-2">Login</p>
                                </div>
                            ) : (
                                <div onClick={handleSignOut} className="flex items-center text-gray-300 cursor-pointer hover:text-blue-400 transition">
                                    <div className="w-6 flex justify-center">
                                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                                    </div>
                                    <p className="ml-2">Logout</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    )
}