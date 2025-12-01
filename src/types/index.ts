import { IconType } from "react-icons";

export interface SocialLink {
  icon: IconType;
  title: string;
  url: string;
}

export interface SpotifyNowPlaying {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  url: string;
  isPlaying: true;
}

export interface SpotifyNotPlaying {
  isPlaying: false;
}

export type SpotifyResponse = SpotifyNowPlaying | SpotifyNotPlaying;
