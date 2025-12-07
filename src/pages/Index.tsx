import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Tools from "@/components/Tools";
import AISection from "@/components/AISection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <AISection />
      <Tools />
      <Footer />
    </div>
  );
};

export default Index;