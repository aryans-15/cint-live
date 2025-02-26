import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartSimple, faCode, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    return (
        <div className="flex w-full h-20 p-2 gap-4">
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
            <div className="justify-end flex">
                <div className="py-2 px-4 items-center flex  text-gray-300 h-full rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faArrowRightToBracket} className="font-bold" />
                    <p className=" pl-2 font-bold">Login</p>
                </div>
            </div>
        </div>
    );
}