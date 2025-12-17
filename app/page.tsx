"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  const title = "Top Mart"
  const router = useRouter()

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-pink-500 flex flex-col items-center px-4">
      <h1 className="text-6xl retro-heading font-bold text-white mt-32 flex">
        {title.split("").map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </h1>
      <motion.p
        className="text-lg retro-text text-white/90 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      >
        Welcome to Top Mart
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      >
        <Button 
         onClick={() => router.push("/login")}
         className="mt-6 bg-pink-600 hover:bg-pink-700 text-white retro-text px-8">Get Started</Button>
      </motion.div>
    </div>
  )
}
