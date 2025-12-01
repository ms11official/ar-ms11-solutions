import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Award, Zap } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About AR-MS11</h1>
            <p className="text-xl text-muted-foreground">
              Empowering businesses with cutting-edge marketing analytics to drive growth and success.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  At AR-MS11, we believe that data-driven insights should be accessible to every business, 
                  regardless of size. Our mission is to democratize marketing analytics and help companies 
                  make informed decisions that drive real results.
                </p>
                <p className="text-muted-foreground">
                  We're committed to providing innovative tools and strategies that transform raw data 
                  into actionable insights, enabling our clients to stay ahead in an ever-evolving digital landscape.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border border-border bg-card">
                  <Users className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">500+</h3>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <Target className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">95%</h3>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <Award className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">10+</h3>
                  <p className="text-sm text-muted-foreground">Industry Awards</p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <Zap className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">24/7</h3>
                  <p className="text-sm text-muted-foreground">Support Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly push boundaries to deliver cutting-edge solutions that keep our clients ahead of the curve.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Client-Centric</h3>
                <p className="text-muted-foreground">
                  Your success is our success. We prioritize understanding your unique needs and delivering personalized solutions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We maintain the highest standards in everything we do, from our technology to our customer service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Behind AR-MS11 is a team of passionate professionals dedicated to helping businesses 
              unlock their full potential through data-driven marketing strategies.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
