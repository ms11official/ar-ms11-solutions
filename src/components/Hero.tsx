import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-xl p-12 sm:p-16 text-center border border-border"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Achieve Unparalleled Marketing Results
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            AR-MS11 provides innovative strategies and cutting-edge tools to elevate your brand and drive growth. Let us help you connect with your audience like never before.
          </p>
          <Button size="lg" className="rounded-lg text-base px-8">
            Schedule a Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
