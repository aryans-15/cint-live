export default function Footer() {
    return (
        <div className="flex w-full h-10 px-3 items-center justify-between bg-gray-800 text-gray-300">
            <div>
                <a 
                    href="https://cint.info" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition duration-300"
                >
                    CInT 2025
                </a>
            </div>
            
            <div>
                Built by Aryan Sharma and Oliver Leung
            </div>
        </div>
    )
}