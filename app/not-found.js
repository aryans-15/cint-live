export default function notfound() {
  return (
    <div className="flex flex-col h-full w-full">
        <div className="flex flex-col items-center justify-center h-full w-full text-white font-mono text-2xl">
            <img src="https://static.wikia.nocookie.net/houkai-star-rail/images/4/44/Sticker_PPG_13_Acheron_03.png" alt="404 Not Found" className="h-40"/>
            <h1 className="text-4xl font-bold mb-4">Not all those that wander are lost...</h1>
            <p className="text-center mb-4">But maybe you are. Go <a href="/">home</a>?</p>
        </div>
    </div>
  );
}
