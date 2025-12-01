import { motion } from "framer-motion";
import logoImage from "../assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
};

export default function Logo({ size = "lg" }: LogoProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1,
      }}
      className={`${sizeClasses[size]} relative`}
    >
      {/* Gradient glow background */}
      <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-30" />

      {/* Logo container with circular mask and subtle border */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-background-card to-background-main p-1 shadow-2xl shadow-primary-dark/30">
        <div className="w-full h-full rounded-full overflow-hidden bg-background-main/50 backdrop-blur-sm">
          <motion.img
            src={logoImage}
            alt="Mathew Dunne Logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-contain p-1 ps-3"
          />
        </div>
      </div>
    </motion.div>
  );
}
