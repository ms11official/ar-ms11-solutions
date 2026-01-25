import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Legal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground">Last Updated: January 1, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using WavexFlow's services, you agree to be bound by these Terms of Service and 
                  all applicable laws and regulations. If you do not agree with any of these terms, you are 
                  prohibited from using or accessing our services.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Use License</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Permission is granted to temporarily access the materials on WavexFlow's platform for personal, 
                  non-commercial transitory viewing only. Under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or public display</li>
                  <li>Attempt to reverse engineer any software contained on WavexFlow's platform</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or mirror the materials on any other server</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you create an account with us, you must provide information that is accurate, complete, and 
                  current at all times. Failure to do so constitutes a breach of the Terms, which may result in 
                  immediate termination of your account. You are responsible for safeguarding the password that you 
                  use to access the service and for any activities or actions under your password.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Service Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  WavexFlow provides a platform for discovering tools and services. We reserve the right to modify, 
                  suspend, or discontinue any aspect of the service at any time, with or without notice. We will not be 
                  liable to you or to any third party for any modification, suspension, or discontinuance of the service.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Prohibited Uses</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">You may not use our service:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall WavexFlow, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential or punitive damages, including without 
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
                  access to or use of or inability to access or use the service.
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 border border-border/50">
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  <span className="text-foreground font-medium">Email:</span> legal@wavexflow.com<br />
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

export default TermsOfService;
