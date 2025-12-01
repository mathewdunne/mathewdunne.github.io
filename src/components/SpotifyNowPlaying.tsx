import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { SpotifyResponse } from "../types";

export default function SpotifyNowPlaying() {
  const { data } = useQuery<SpotifyResponse>({
    queryKey: ["spotify-now-playing"],
    queryFn: async () => {
      const response = await fetch("https://spotify.mathewdunne.ca/");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000,
  });

  return (
    <AnimatePresence mode="wait">
      {data?.isPlaying && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-8 pt-3 pb-5 border-t border-gray-800"
        >
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group/now-playing"
          >
            {/* Album Cover */}
            <div className="relative flex-shrink-0">
              <motion.img
                src={data.albumImageUrl}
                alt={data.album}
                className="w-12 h-12 rounded-lg shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              />
              {/* Playing indicator */}
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Now Playing
                </span>
              </div>
              <p className="text-sm font-medium text-white truncate group-hover/now-playing:text-primary-light transition-colors">
                {data.title}
              </p>
              <p className="text-xs text-gray-400 truncate">{data.artist}</p>
            </div>

            {/* Equalizer Animation */}
            <div className="flex items-end gap-0.5 h-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary-light rounded-full"
                  animate={{
                    height: ["40%", "100%", "60%", "80%", "40%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
