"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FiPause, FiPlay, FiRotateCcw, FiRotateCw } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { FINISHED_BOOKS_KEY, saveBookToStorage, toSavedBook } from "@/lib/library";
import { Book } from "@/types/book";

const FALLBACK_DURATION = 292;
const SKIP_SECONDS = 10;

type PlayerClientProps = {
  book: Book;
};

export default function PlayerClient({ book }: PlayerClientProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const audioElement = audio;

    function handleLoadedMetadata() {
      if (Number.isFinite(audioElement.duration)) {
        setDuration(audioElement.duration);
      }
    }

    function handleTimeUpdate() {
      setCurrentTime(audioElement.currentTime);
    }

    function handleEnded() {
      setIsPlaying(false);
      setCurrentTime(0);
      saveBookToStorage(FINISHED_BOOKS_KEY, toSavedBook(book));
    }

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [book]);

  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await audio.play();
    setIsPlaying(true);
  }

  function skipBy(seconds: number) {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleSeek(event: ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    setCurrentTime(nextTime);

    if (audio) {
      audio.currentTime = nextTime;
    }
  }

  return (
    <>
      <Sidebar />
      <main className="player-page with-sidebar">
      <div className="player-page__shell">
        <SearchBar />

        <section className="player-page__hero">
          <p className="player-page__eyebrow">Now playing</p>
          <h1 className="player-page__title">{book.title}</h1>
          <p className="player-page__author">By {book.author}</p>
        </section>

        <section className="audio-player" aria-label={`${book.title} audio player`}>
          <audio ref={audioRef} src={book.audioLink} preload="metadata" />

          <div className="audio-player__controls">
            <button
              aria-label="Skip back 10 seconds"
              className="audio-player__skip"
              onClick={() => skipBy(-SKIP_SECONDS)}
              type="button"
            >
              <FiRotateCcw />
            </button>
            <button
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
              className="audio-player__play"
              onClick={togglePlay}
              type="button"
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button
              aria-label="Skip forward 10 seconds"
              className="audio-player__skip"
              onClick={() => skipBy(SKIP_SECONDS)}
              type="button"
            >
              <FiRotateCw />
            </button>
          </div>

          <div className="audio-player__timeline">
            <span className="audio-player__time">{formatTime(currentTime)}</span>
            <input
              aria-label="Audio progress"
              className="audio-player__range"
              max={duration}
              min={0}
              onChange={handleSeek}
              step={1}
              type="range"
              value={Math.min(currentTime, duration)}
            />
            <span className="audio-player__time">{formatTime(duration)}</span>
          </div>
        </section>

        <section className="player-page__summary-section">
          <h2 className="player-page__section-title">Summary</h2>
          <p className="player-page__summary">{book.summary}</p>
        </section>
      </div>
      </main>
    </>
  );
}

function formatTime(timeInSeconds: number) {
  const safeTime = Number.isFinite(timeInSeconds) ? Math.floor(timeInSeconds) : 0;
  const minutes = Math.floor(safeTime / 60);
  const seconds = safeTime % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
