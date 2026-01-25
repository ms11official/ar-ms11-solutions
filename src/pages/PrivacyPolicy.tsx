import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Legal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: January 1, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to WavexFlow. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit 
                  our website and tell you about your privacy rights and how the law protects you.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">We may collect, use, store and transfer different kinds of personal data about you:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Identity Data:</strong> First name, last name, username or similar identifier</li>
                  <li><strong className="text-foreground">Contact Data:</strong> Email address, telephone numbers, and billing address</li>
                  <li><strong className="text-foreground">Technical Data:</strong> IP address, browser type and version, time zone setting</li>
                  <li><strong className="text-foreground">Usage Data:</strong> Information about how you use our website and services</li>
                  <li><strong className="text-foreground">Marketing Data:</strong> Your preferences in receiving marketing from us</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our service</li>
                  <li>To monitor the usage of our service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We have put in place appropriate security measures to prevent your personal data from being 
                  accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit 
                  access to your personal data to those employees, agents, contractors and other third parties 
                  who have a business need to know.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Your Legal Rights</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Request access to your personal data</li>
                  <li>Request correction of your personal data</li>
                  <li>Request erasure of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  <span className="text-foreground font-medium">Email:</span> privacy@wavexflow.com<br />
                  <span className="text-foreground font-medium">Phone:</span> +1 (555) 123-4567<br />
                  <span className="text-foreground font-medium">Address:</span> 123 Innovation Street, San Francisco, CA 94105
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
