import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, Users, Zap, Heart, ArrowRight } from "lucide-react";

const Careers = () => {
  const jobs = [
    {
      title: "Senior Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive and beautiful user experiences for our platform.",
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Build and maintain our cutting-edge tools discovery platform.",
    },
    {
      title: "Content Strategist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Lead content creation and strategy to help users discover the best tools.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "New York, NY",
      type: "Full-time",
      description: "Help our users succeed by providing exceptional support and guidance.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Growth Opportunities",
      description: "We invest in your professional development with continuous learning opportunities and clear career paths.",
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "Flexible work arrangements, generous PTO, and a culture that values your well-being.",
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work alongside talented, passionate individuals who are committed to excellence.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Careers</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Join Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us shape the future of tool discovery. We're looking for talented individuals 
              who are passionate about making a difference.
            </p>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Why Join WavexFlow?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer a unique opportunity to work on exciting projects while enjoying great benefits.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border/50 bg-card text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-foreground">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Open Positions</h2>
              <p className="text-muted-foreground">Find your perfect role and start your journey with us.</p>
            </div>
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <Card key={index} className="border-border/50 bg-card hover:shadow-lg transition-all hover:border-primary/30">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl mb-2 text-foreground">{job.title}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">{job.description}</CardDescription>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 shrink-0">
                        Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-primary text-white border-0">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Don't See a Perfect Fit?</h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">
                  We're always looking for talented individuals. Send us your resume and tell us why 
                  you'd be a great addition to the WavexFlow team.
                </p>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Send Your Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
