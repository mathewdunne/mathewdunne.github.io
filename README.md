# Mathew Dunne - Portfolio Website

A modern, clean portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Clean, linktree-style layout with a dark theme
- **Smooth Animations**: Beautiful transitions and hover effects using Framer Motion
- **Responsive**: Fully responsive design that works on all devices
- **Custom Branding**: Blue gradient color scheme (#8ccce6 to #1e337a)
- **Easy to Maintain**: Well-organized component structure

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Header with name and logo
│   ├── Logo.tsx        # Animated logo component
│   └── LinkCard.tsx    # Individual social link card
├── constants/          # App constants
│   └── socialLinks.ts  # Your social media links
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind
```

## 🎨 Customization

### Update Your Social Links

Edit `src/constants/socialLinks.ts` to add or modify your social media links:

```typescript
import { FaGithub } from "react-icons/fa6";

export const socialLinks: SocialLink[] = [
  {
    icon: FaGithub, // Icon from react-icons
    title: "GitHub", // Display name
    url: "https://...", // Your URL
  },
  // Add more links...
];
```

### Available Icons

The project uses [React Icons](https://react-icons.github.io/react-icons/) with Font Awesome 6. Some popular icons:

**From `react-icons/fa6` (Font Awesome 6):**

- `FaGithub`, `FaLinkedin`, `FaTwitter`, `FaInstagram`, `FaFacebook`
- `FaYoutube`, `FaTwitch`, `FaDiscord`, `FaSpotify`
- `FaCode`, `FaBriefcase`, `FaEnvelope`

**From other icon sets:**

- `MdEmail` (Material Design)
- `HiGlobeAlt` (Heroicons)
- Browse all available icons at [react-icons.github.io](https://react-icons.github.io/react-icons/)

### Change Your Name and Title

Edit `src/components/Header.tsx`:

```typescript
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
  <span className="text-gradient">Your Name</span>
</h1>
<p className="text-gray-400 text-lg md:text-xl">
  Your Title
</p>
```

### Customize Logo

Replace `src/assets/logo.png` with your own logo image. The component automatically displays it in a circular container with a gradient glow effect.

### Adjust Colors

The color scheme is defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    light: '#8ccce6',
    dark: '#1e337a',
  },
  background: {
    main: '#0a0a0f',
    card: '#13131a',
  }
}
```

## 🛠️ Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icons (Font Awesome 6, Material Design, Heroicons)

## 🌐 Deployment

This site is ready to be deployed to GitHub Pages. Simply:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your GitHub Pages

Or use GitHub Actions for automatic deployment.

## 📝 License

© 2025 Mathew Dunne. All rights reserved.
