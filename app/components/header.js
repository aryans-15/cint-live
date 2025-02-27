"use client"

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartSimple, faCode, faArrowRightToBracket, faBars } from "@fortawesome/free-solid-svg-icons";
import { useUserSession } from '@/hooks/use-user-session';
import { signInWithGoogle, signOutWithGoogle } from '@/libs/firebase/auth';
import { createSession, removeSession } from '@/actions/auth-actions';
import { useAuthUser } from '@/hooks/use-auth-user';

export default function Header({ session }) {
    const elementRef = useRef(null);
    const userSessionId = useUserSession(session);
    const user = useAuthUser(userSessionId);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleSignIn = async () => {
        const uid = await signInWithGoogle();
        if (uid) {
            await createSession(uid);
        }
    };

    const handleSignOut = async () => {
        await signOutWithGoogle();
        await removeSession();
    };

    useEffect(() => {
        const handleClick = (event) => {
            if (confirmLogout && (!elementRef.current || !elementRef.current.contains(event.target))) {
                setConfirmLogout(false);
            }
        };
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [confirmLogout]);

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
                            <FontAwesomeIcon icon={faArrowRightToBracket} className="font-bold" />
                            <p className="ml-2 font-bold">Login</p>
                        </div>
                    </div>
                ) : (
                    user && (
                        <div className="hidden md:flex flex-col text-gray-300 relative">
                            <div className="py-2 px-4 flex items-center rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out" onClick={() => setConfirmLogout(!confirmLogout)}>
                                {user.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="User Avatar" 
                                        className="h-8 w-8 rounded-full mr-2"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />
                                ) : (
                                    <img 
                                        src="/default-avatar.png" 
                                        alt="Default Avatar" 
                                        className="h-8 w-8 rounded-full mr-2" 
                                    />
                                )}
                                <p className="ml-2 font-bold">Hi {user.displayName?.split(" ")[0]}!</p>
                            </div>
                            {confirmLogout && (
                                <div 
                                    ref={elementRef} 
                                    onClick={handleSignOut} 
                                    className={`${confirmLogout ? "animate-fadeIn" : ""} absolute top-full left-0 w-full text-center py-2 bg-rose-600 text-white rounded-xl cursor-pointer hover:bg-rose-700 transition duration-300 ease-in-out mt-2`}
                                >
                                    Logout
                                </div>
                            )}
                        </div>
                    )
                )}
                <div className="md:hidden">
                    <button onClick={() => setIsDrawerOpen(true)} className="text-gray-300">
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                </div>
            </div>

            {isDrawerOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="w-64 bg-gray-800 h-full shadow-lg p-4 transform animate-slide-in">
                        <div className="flex justify-end">
                            <button className=" text-lg text-gray-300 hover:text-blue-400 transition" onClick={() => setIsDrawerOpen(false)}>✖</button>
                        </div>
                        <div className="mt-4 flex flex-col space-y-4">
                            {navItems.map((item, index) => (
                                <div key={index} className="flex items-center text-gray-300 cursor-pointer hover:text-blue-400 transition">
                                    <FontAwesomeIcon icon={item.icon} className="w-6" />
                                    <p className="ml-2">{item.label}</p>
                                </div>
                            ))}
                            {!userSessionId ? (
                                <div onClick={handleSignIn} className="flex items-center text-gray-300 cursor-pointer hover:text-blue-400 transition">
                                    <FontAwesomeIcon icon={faArrowRightToBracket} className="w-6" />
                                    <p className="ml-2">Login</p>
                                </div>
                            ) : (
                                <div onClick={handleSignOut} className="flex items-center text-gray-300 cursor-pointer hover:text-rose-600 transition">
                                    <FontAwesomeIcon icon={faArrowRightToBracket} className="w-6" />
                                    <p className="ml-2">Logout</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}