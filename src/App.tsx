import { motion } from 'framer-motion';
import Header from './components/Header';
import LinkCard from './components/LinkCard';
import { socialLinks } from './constants/socialLinks';
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

function App() {
  return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <ShootingStars minDelay={600} maxDelay={4000} maxSpeed={15}/>
          <StarsBackground />
          <div className="w-full max-w-2xl">
              <Header />

              {/* About Section */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-center mb-8 px-4"
              >
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                      Hi, my name is Matt.
                      <br />I use this domain for personal projects.
                      <br />
                      Check out my links below:
                  </p>
              </motion.div>

              <main className="flex flex-col items-center gap-4">
                  {socialLinks.map((link, index) => (
                      <LinkCard
                          key={link.title}
                          icon={link.icon}
                          title={link.title}
                          url={link.url}
                          delay={0.7 + index * 0.1}
                      />
                  ))}
              </main>

              {/* Footer */}
              <footer className="mt-12 text-center">
                  <p className="text-gray-500 text-sm">
                      © {new Date().getFullYear()} Mathew Dunne. 
                      <br />Hosted using
                      GitHub Pages.{" "}
                      <a
                          href="https://github.com/mathewdunne/mathewdunne.github.io"
                          className="underline"
                      >
                          View Source
                      </a>
                  </p>
              </footer>
          </div>
      </div>
  );
}

export default App;
