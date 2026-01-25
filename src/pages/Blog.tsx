import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Blog = () => {
  const posts = [
    {
      title: "10 Essential Tools Every Developer Needs in 2026",
      excerpt: "Discover the must-have tools that will supercharge your development workflow and boost productivity.",
      category: "Development",
      author: "Sarah Johnson",
      date: "January 15, 2026",
      readTime: "5 min read",
    },
    {
      title: "How to Choose the Right Service for Your Project",
      excerpt: "Learn effective strategies to evaluate and select the best services for your specific needs.",
      category: "Guide",
      author: "Michael Chen",
      date: "January 10, 2026",
      readTime: "7 min read",
    },
    {
      title: "The Future of AI-Powered Tools",
      excerpt: "Understanding how AI is transforming the tools landscape and what it means for creators.",
      category: "AI",
      author: "Emily Rodriguez",
      date: "January 5, 2026",
      readTime: "6 min read",
    },
    {
      title: "Maximizing Productivity with the Right Tools",
      excerpt: "Master the art of tool selection to deliver more efficient and effective results.",
      category: "Productivity",
      author: "David Park",
      date: "December 28, 2025",
      readTime: "8 min read",
    },
    {
      title: "Optimizing Your Workflow with WavexFlow",
      excerpt: "A comprehensive guide to using WavexFlow to identify and leverage the best tools for your needs.",
      category: "Tutorial",
      author: "Sarah Johnson",
      date: "December 20, 2025",
      readTime: "10 min read",
    },
    {
      title: "Building Better Products with Modern Services",
      excerpt: "Explore how modern services are revolutionizing the way we build and launch products.",
      category: "Technology",
      author: "Michael Chen",
      date: "December 15, 2025",
      readTime: "9 min read",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Blog</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">WavexFlow Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, guides, and best practices to help you discover and use the best tools and services.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 bg-card">
                  <CardHeader>
                    <div className="mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors text-foreground">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <span className="text-primary font-medium">{post.readTime}</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/10 group-hover:text-primary">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter and get the latest insights, tips, and updates delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="h-12 bg-white text-primary hover:bg-white/90 font-medium px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
