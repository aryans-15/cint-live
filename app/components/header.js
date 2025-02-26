'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartSimple, faCode, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { useUserSession } from '@/hooks/use-user-session';
import { signInWithGoogle, signOutWithGoogle } from '@/libs/firebase/auth';
import { createSession, removeSession } from '@/actions/auth-actions';

export default function Header({ session }) {
    const userSessionId = useUserSession(session);

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

    return (
        <div className="flex w-full h-20 gap-4">
            <div className="flex justify-start grow">
                <img src="/logo.png" alt="Logo" className="h-full pr-6" />
                <div className="py-2 px-4 items-center flex text-gray-300 h-full rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faHouse} className="" />
                    <p className=" pl-2 font">Home</p>
                </div>
                <div className="py-2 px-4 items-center flex text-gray-300 h-full rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faChartSimple} className="" />
                    <p className=" pl-2 font">Scoreboard</p>
                </div>
                <div className="py-2 px-4 items-center flex text-gray-300 h-full rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faCode} className="" />
                    <p className=" pl-2 font">Challenges</p>
                </div>
            </div>
            {!userSessionId ? (
                <div className="justify-end flex" onClick={handleSignIn}>
                    <div className="py-2 px-4 items-center flex  text-gray-300 h-full rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                        <FontAwesomeIcon icon={faArrowRightToBracket} className="font-bold" />
                        <p className=" pl-2 font-bold">Login</p>
                    </div>
                </div>

            ) : (
                <div className="justify-end flex" onClick={handleSignOut}>
                    <div className="py-2 px-4 items-center flex  text-gray-300 h-full rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                        <FontAwesomeIcon icon={faArrowRightToBracket} className="font-bold" />
                        <p className=" pl-2 font-bold">Logout</p>
                    </div>
                </div>
            )}
        </div>
    )
}