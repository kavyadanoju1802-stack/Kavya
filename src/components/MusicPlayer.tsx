import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Algorithmic Synthesis v1.0",
    artist: "AI Gen Model Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Neural Network Groove",
    artist: "AI Gen Model Beta",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Deep Learning Melody",
    artist: "AI Gen Model Gamma",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
         console.error("Playback failed", e);
         setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);


  return (
    <div className="glass-panel rounded-2xl w-full p-4 md:p-6 flex flex-col gap-4 md:gap-6 items-center z-20 shrink-0">
      <audio
         ref={audioRef}
         src={track.url}
         onTimeUpdate={handleTimeUpdate}
         onEnded={handleTrackEnd}
         onLoadedData={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
         }}
      />

      <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-white/20 p-2 flex items-center justify-center transition-transform duration-700 ease-linear ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#39FF14]/20 to-[#00FFFF]/20 flex items-center justify-center">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-1 md:gap-1.5 items-center justify-center h-full">
                 <div className="w-1 h-3 md:h-4 bg-black rounded-sm"></div>
                 <div className="w-1 h-3 md:h-4 bg-black rounded-sm"></div>
              </div>
            ) : (
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent md:border-t-[8px] md:border-l-[14px] md:border-b-[8px] ml-1"></div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center w-full">
        <h2 className="font-bold text-white text-base md:text-lg truncate">{track.title}</h2>
        <p className="text-xs text-white/50 mt-1 truncate">{track.artist}</p>
        <p className="text-xs text-white/50 mono mt-2">{formatTime(progress)} / {formatTime(duration)}</p>
      </div>

      <div className="w-full relative px-2">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none focus:outline-none block"
          style={{
             background: `linear-gradient(to right, #00FFFF ${(progress / duration) * 100}%, rgba(255,255,255,0.1) ${(progress / duration) * 100}%)`
          }}
        />
      </div>

      <div className="flex gap-4 md:gap-6 items-center w-full justify-between mt-2">
        <button
           onClick={() => setIsMuted(!isMuted)}
           className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
           {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex gap-4 items-center">
           <button
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center opacity-40 hover:opacity-100 cursor-pointer text-xl text-white pb-1"
           >
             «
           </button>
           <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center text-lg active:scale-95 transition-transform font-bold"
           >
             {isPlaying ? '||' : '►'}
           </button>
           <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center opacity-40 hover:opacity-100 cursor-pointer text-xl text-white pb-1"
           >
             »
           </button>
        </div>
        
        <div className="w-8 flex items-center justify-center text-xs mono text-white/40">
           {currentTrackIndex + 1}/{TRACKS.length}
        </div>
      </div>
    </div>
  );
}
