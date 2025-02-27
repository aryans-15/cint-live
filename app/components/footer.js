export default function Footer() {
    return (
        <div className="flex w-full h-10 px-3 items-center justify-between bg-gray-800 text-gray-300">
            <div>
                <a
                    href="https://cint.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition duration-300 hover:underline"
                >
                    CInT 2025
                </a>
            </div>

            <div>
                Built by <span> </span>
                <a href="https://github.com/aryans-15/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300 hover:underline">
                    Aryan Sharma
                </a> and <span> </span>
                <a href="https://github.com/kyracoding/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300 hover:underline">
                Kyra Leung
                </a>
            </div>
        </div>
    )
}