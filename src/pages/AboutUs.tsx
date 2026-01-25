import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Zap, Heart, Globe } from "lucide-react";

const AboutUs = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Active Users" },
    { icon: Target, value: "500+", label: "Tools Listed" },
    { icon: Award, value: "50+", label: "Categories" },
    { icon: Zap, value: "24/7", label: "Support" },
  ];

  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge solutions that keep our users ahead of the curve.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Your success is our success. We prioritize understanding your unique needs and delivering personalized solutions.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from our platform to our customer service.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about helping people discover the tools that will transform their work.",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "We believe great tools should be accessible to everyone, regardless of their background or experience.",
    },
    {
      icon: Zap,
      title: "Speed",
      description: "We value your time and strive to help you find what you need as quickly as possible.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">About WavexFlow</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering creators and developers with curated tools and services to build amazing things.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-0">Our Mission</Badge>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Simplifying Tool Discovery</h2>
                <p className="text-muted-foreground mb-4 text-lg">
                  At WavexFlow, we believe that finding the right tools shouldn't be a struggle. 
                  Our mission is to democratize access to the best tools and services, helping 
                  individuals and teams work smarter, not harder.
                </p>
                <p className="text-muted-foreground text-lg">
                  We're committed to curating, reviewing, and presenting tools in a way that makes 
                  decision-making simple and informed.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-border/50 bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">Our Values</Badge>
              <h2 className="text-3xl font-bold mb-4 text-foreground">What Drives Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our core values guide everything we do, from how we build our platform to how we interact with our community.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-border/50 bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Our Team</Badge>
            <h2 className="text-3xl font-bold mb-6 text-foreground">The People Behind WavexFlow</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Behind WavexFlow is a team of passionate professionals dedicated to helping 
              people discover and utilize the best tools for their projects. We're dreamers, 
              builders, and problem-solvers united by our love for great products.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
