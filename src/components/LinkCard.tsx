import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { useState, ReactNode } from "react";

interface LinkCardProps {
  icon: IconType;
  title: string;
  url: string;
  delay?: number;
  children?: ReactNode;
}

export default function LinkCard({
  icon: Icon,
  title,
  url,
  delay = 0,
  children,
}: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative w-full max-w-md group"
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300" />

      {/* Card content */}
      <div className="relative bg-background-card rounded-2xl border border-gray-800 group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary-dark/20">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center gap-4 px-8 py-5"
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Icon className="w-6 h-6 text-primary-light" />
          </motion.div>

          {/* Title */}
          <span className="text-lg font-medium text-white group-hover:text-gradient transition-colors duration-300">
            {title}
          </span>

          {/* Arrow indicator */}
          <motion.svg
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 ml-auto text-gray-500 group-hover:text-primary-light transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </motion.svg>
        </a>

        {/* Optional children (like Now Playing widget) */}
        {children}
      </div>
    </motion.div>
  );
}
