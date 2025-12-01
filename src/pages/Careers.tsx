import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Clock } from "lucide-react";

const Careers = () => {
  const jobs = [
    {
      title: "Senior Marketing Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      description: "Lead data-driven marketing strategies and help clients achieve their growth goals.",
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "New York, NY",
      type: "Full-time",
      description: "Build and maintain our cutting-edge marketing analytics platform.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive and beautiful user experiences for our clients.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Help our clients succeed by providing exceptional support and guidance.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us shape the future of marketing analytics. We're looking for talented individuals 
              who are passionate about data, innovation, and making an impact.
            </p>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Join AR-MS11?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We invest in your professional development with continuous learning opportunities 
                    and clear career progression paths.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Work-Life Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Flexible work arrangements, generous PTO, and a culture that values your well-being 
                    and personal time.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Comprehensive health coverage, 401(k) matching, stock options, and other perks 
                    that support your financial health.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Open Positions</h2>
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-base">{job.description}</CardDescription>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Don't See a Perfect Fit?</h2>
            <p className="text-muted-foreground mb-8">
              We're always looking for talented individuals. Send us your resume and tell us why 
              you'd be a great addition to the AR-MS11 team.
            </p>
            <Button size="lg">Send Your Resume</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
