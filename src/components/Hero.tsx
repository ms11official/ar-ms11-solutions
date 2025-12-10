import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroContent = [
  {
    title: "Achieve Unparalleled Marketing Results",
    description: "AR-MS11 provides innovative strategies and cutting-edge tools to elevate your brand and drive growth."
  },
  {
    title: "AI-Powered Automation Solutions",
    description: "Transform your workflow with intelligent automation that saves time and boosts productivity."
  },
  {
    title: "Scale Your Business with Smart Tools",
    description: "Access premium AI tools and services designed to accelerate your business growth."
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContent.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/90 backdrop-blur-md rounded-xl p-12 sm:p-16 text-center border border-border"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {heroContent[currentIndex].title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                {heroContent[currentIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
          <Button size="lg" className="rounded-lg text-base px-8">
            Schedule a Demo
          </Button>
          
          <div className="flex justify-center gap-2 mt-8">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;