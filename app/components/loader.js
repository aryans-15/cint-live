import Typewriter from 'typewriter-effect';
import { useEffect, useState } from 'react';

export default function Loader() {
    const originalMessages = [
        'printf("Loading...");',
        'Console.WriteLine("Loading...");',
        'std::cout << "Loading..." << std::endl;',
        'writeln("Loading...");',
        'fmt.Println("Loading...")',
        'main = putStrLn "Loading..."',
        'System.out.println("Loading...");',
        'console.log("Loading...");',
        'println("Loading...")',
        'print_endline "Loading...";;',
        'print "Loading...";',
        'echo "Loading...";',
        'print("Loading...")',
        'puts "Loading..."',
        'println!("Loading...");',
    ]

    const [loadingMessages, setLoadingMessages] = useState([]);

    useEffect(() => {
        const shuffled = [...originalMessages].sort(() => Math.random() - 0.5);
        setLoadingMessages(shuffled);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full font-mono">
            <div className="text-4xl font-bold animate-pulse">
                {loadingMessages.length > 0 ? (
                    <Typewriter
                        className="text-6xl font-bold animate-pulse"
                        options={{
                            strings: loadingMessages,
                            autoStart: true,
                            loop: true,
                            pauseFor: 900,
                            cursor: '',
                            deleteSpeed: 25,
                            delay: 25,
                        }}
                    />
                ) : (
                    <div className="font-bold opacity-0">Loading the loading messages...</div>
                )}
            </div>
            <p className='mt-4 text-2xl'>If this is taking a while, try reloading the page.</p>
        </div>
    );
}
