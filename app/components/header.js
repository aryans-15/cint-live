"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartSimple, faCode, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect, useRef } from 'react';
import { useUserSession } from '@/hooks/use-user-session';
import { signInWithGoogle, signOutWithGoogle } from '@/libs/firebase/auth';
import { createSession, removeSession } from '@/actions/auth-actions';
import { useAuthUser } from '@/hooks/use-auth-user';


export default function Header({ session }) {
    const elementRef = useRef(null);
    const useruid = useUserSession(session);
    const user = useAuthUser(useruid);
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

    return (
        <div className="flex w-full h-20 gap-4 z-10">
            <div className="flex justify-start grow">
                <img src="/logo.png" alt="Logo" className="h-full pr-6" />
                <div className="py-2 px-4 items-center flex text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faHouse} className="" />
                    <p className=" pl-2 font">Home</p>
                </div>
                <div className="py-2 px-4 items-center flex text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faChartSimple} className="" />
                    <p className=" pl-2 font">Scoreboard</p>
                </div>
                <div className="py-2 px-4 items-center flex text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faCode} className="" />
                    <p className=" pl-2 font">Challenges</p>
                </div>
            </div>
            {!useruid ? (
                <div className="justify-end flex" onClick={handleSignIn}>
                    <div className="py-2 px-4 items-center flex text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                        <FontAwesomeIcon icon={faArrowRightToBracket} className="font-bold" />
                        <p className=" pl-2 font-bold">Login</p>
                    </div>
                </div>
            ) : (
                user ? (
                    <div className="justify-end flex-col text-gray-300" onClick={() => setConfirmLogout(!confirmLogout)}>
                        <div className="flex-row h-full">
                            <div className={`py-2 px-4 items-center flex  h-full rounded-xl cursor-pointer ${confirmLogout ? "bg-gray-700" : ""} hover:bg-gray-700  transition duration-300 ease-in-out`}>
                                <img src={user.photoURL} alt="User Avatar" className="aspect-square h-full rounded-full mr-2" />
                                <p className="pl-2 font-bold">Hi {user.displayName.split(" ")[0]}!</p>
                            </div>
                        </div>
                        {confirmLogout && (
                            <div ref={elementRef} onClick={handleSignOut} className={`${confirmLogout ? "animate-fadeIn" : ""} font-bold cursor-pointer flex w-full h-fit p-2 rounded-xl bg-rose-600 hover:bg-rose-700 transition duration-300 ease-in-out mt-1`}>
                                <p className="text-center w-full">Logout</p>
                            </div>
                        )}
                    </div>
                ) : (
                    null
                )
            )
            }
        </div >
    )
}