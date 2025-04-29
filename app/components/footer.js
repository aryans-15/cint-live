export default function Footer() {
    return (
        <div className="flex w-full h-10 px-3 pt-2 items-center justify-between bg-gray-800 text-gray-300">
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
                Built by {' '}
                <a href="https://aryans.dev/" target="_blank" rel="noopener noreferrer">
                    Aryan Sharma
                </a> and {' '}
                <a href="https://github.com/kyracoding/" target="_blank" rel="noopener noreferrer">
                    Kyra Leung
                </a> for {' '}
                <a href="https://chspyoneers.com" target="_blank" rel="noopener noreferrer">
                    CHS Pyoneers
                </a>
            </div>
        </div>
    )
}