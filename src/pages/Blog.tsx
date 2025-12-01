import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      title: "10 Marketing Analytics Trends to Watch in 2025",
      excerpt: "Discover the latest trends shaping the future of marketing analytics and how they can benefit your business.",
      category: "Trends",
      author: "Sarah Johnson",
      date: "December 15, 2024",
      readTime: "5 min read",
    },
    {
      title: "How to Measure ROI on Your Marketing Campaigns",
      excerpt: "Learn effective strategies to accurately measure and improve your marketing campaign returns.",
      category: "Analytics",
      author: "Michael Chen",
      date: "December 10, 2024",
      readTime: "7 min read",
    },
    {
      title: "The Power of Data-Driven Decision Making",
      excerpt: "Understanding how leveraging data can transform your marketing strategy and drive growth.",
      category: "Strategy",
      author: "Emily Rodriguez",
      date: "December 5, 2024",
      readTime: "6 min read",
    },
    {
      title: "Customer Segmentation Best Practices",
      excerpt: "Master the art of customer segmentation to deliver more personalized marketing experiences.",
      category: "Customer Insights",
      author: "David Park",
      date: "November 28, 2024",
      readTime: "8 min read",
    },
    {
      title: "Optimizing Your Marketing Funnel with Analytics",
      excerpt: "A comprehensive guide to using analytics to identify and fix bottlenecks in your marketing funnel.",
      category: "Optimization",
      author: "Sarah Johnson",
      date: "November 20, 2024",
      readTime: "10 min read",
    },
    {
      title: "AI and Machine Learning in Marketing Analytics",
      excerpt: "Explore how AI and ML are revolutionizing the way we analyze and act on marketing data.",
      category: "Technology",
      author: "Michael Chen",
      date: "November 15, 2024",
      readTime: "9 min read",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AR-MS11 Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, trends, and best practices in marketing analytics to help you stay ahead.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
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
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Get the latest insights and updates delivered directly to your inbox.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-border bg-background"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
