import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center gap-3 mb-6">
      <Logo size="lg" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
          <span className="text-gradient">Mathew Dunne</span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-lg md:text-xl"
        >
          Developer
        </motion.p>
      </motion.div>
    </header>
  );
}
