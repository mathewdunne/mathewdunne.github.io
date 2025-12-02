import { motion } from "framer-motion";
import { IconType } from "react-icons";
import {
  SiVite,
  SiTailwindcss,
  SiFramer,
  SiShadcnui,
  SiClaude,
  SiReact,
  SiGithub,
  SiCloudflare,
  SiTypescript,
} from "react-icons/si";

interface MadeWithLogoProps {
  icon: IconType;
  href: string;
  label: string;
  hoverColor: string;
}

function MadeWithLogo({
  icon: Icon,
  href,
  label,
  hoverColor,
}: MadeWithLogoProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-gray-400 hover:text-[${hoverColor}] transition-colors duration-200 hover:scale-110 transform`}
      aria-label={label}
      style={
        {
          "--hover-color": hoverColor,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "";
      }}
    >
      <Icon className="text-2xl" />
    </a>
  );
}

export function MadeWithSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="mb-6"
    >
      <p className="text-gray-400 text-sm mb-3">Made with:</p>
      <div className="flex justify-center items-center gap-4 flex-wrap">
        <MadeWithLogo
          icon={SiReact}
          href="https://react.dev"
          label="React"
          hoverColor="#61DAFB"
        />
        <MadeWithLogo
          icon={SiVite}
          href="https://vitejs.dev"
          label="Vite"
          hoverColor="#646CFF"
        />
        <MadeWithLogo
          icon={SiTypescript}
          href="https://www.typescriptlang.org"
          label="TypeScript"
          hoverColor="#3178C6"
        />
        <MadeWithLogo
          icon={SiTailwindcss}
          href="https://tailwindcss.com"
          label="Tailwind CSS"
          hoverColor="#06B6D4"
        />
        <MadeWithLogo
          icon={SiFramer}
          href="https://www.framer.com/motion"
          label="Framer Motion"
          hoverColor="#0055FF"
        />
        <MadeWithLogo
          icon={SiShadcnui}
          href="https://ui.shadcn.com"
          label="ShadCN UI"
          hoverColor="#FFFFFF"
        />
        <MadeWithLogo
          icon={SiGithub}
          href="https://github.com"
          label="GitHub"
          hoverColor="#6E5494"
        />
        <MadeWithLogo
          icon={SiCloudflare}
          href="https://www.cloudflare.com"
          label="Cloudflare"
          hoverColor="#F38020"
        />
        <MadeWithLogo
          icon={SiClaude}
          href="https://claude.ai"
          label="Claude AI"
          hoverColor="#D97706"
        />
      </div>
    </motion.div>
  );
}
