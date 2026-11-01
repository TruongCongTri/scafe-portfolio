"use client";

import { useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { getAudioState, getServerAudioState, subscribeAudio, toggleAudio } from "@/lib/audio";
import "./AudioPlayer.css";

export function AudioPlayer() {
  const { shell } = useI18n().t;
  const { track, playing, failed } = useSyncExternalStore(subscribeAudio, getAudioState, getServerAudioState);

  if (!track || failed) return null;

  return (
    <button
      type="button"
      className={`audio-player ${playing ? "is-playing" : ""}`}
      aria-label={`${playing ? shell.audioPause : shell.audioPlay}: ${track.title}`}
      aria-pressed={playing}
      onClick={toggleAudio}
    >
      <span className="audio-player__icon" aria-hidden="true" />
      <span className="audio-player__bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="audio-player__name">{track.title}</span>
    </button>
  );
}
