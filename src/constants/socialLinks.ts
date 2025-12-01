import { FaGithub, FaLinkedin, FaStrava, FaLetterboxd, FaInstagram } from 'react-icons/fa6';
import { SocialLink } from '../types';

export const socialLinks: SocialLink[] = [
  {
    icon: FaLinkedin,
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/mathewdunne',
  },
  {
    icon: FaGithub,
    title: 'GitHub',
    url: 'https://github.com/mathewdunne',
  },
  {
    icon: FaInstagram,
    title: 'Instagram',
    url: 'https://www.instagram.com/mathewdunne_/',
  },
  {
    icon: FaLetterboxd,
    title: 'Letterboxd',
    url: 'https://letterboxd.com/mdunne/',
  },
  {
    icon: FaStrava,
    title: 'Strava',
    url: 'https://www.strava.com/athletes/139153547',
  },
];
