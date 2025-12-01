import {
  FaGithub,
  FaLinkedin,
  FaStrava,
  FaLetterboxd,
  FaInstagram,
  FaSpotify,
} from "react-icons/fa6";
import { SocialLink } from "../types";

export const socialLinks: SocialLink[] = [
  {
    icon: FaLinkedin,
    title: "LinkedIn",
    url: "https://linkedin.com/in/mathewdunne",
  },
  {
    icon: FaGithub,
    title: "GitHub",
    url: "https://github.com/mathewdunne",
  },
  {
    icon: FaInstagram,
    title: "Instagram",
    url: "https://www.instagram.com/mathewdunne_/",
  },
  {
    icon: FaSpotify,
    title: "Spotify",
    url: "https://open.spotify.com/user/md26271?si=a3e9873af5a34a8d",
  },
  {
    icon: FaLetterboxd,
    title: "Letterboxd",
    url: "https://letterboxd.com/mdunne/",
  },
  {
    icon: FaStrava,
    title: "Strava",
    url: "https://www.strava.com/athletes/139153547",
  },
];
