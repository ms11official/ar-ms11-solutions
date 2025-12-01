import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: December 1, 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to AR-MS11. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit 
                  our website and tell you about your privacy rights and how the law protects you.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Identity Data:</strong> First name, last name, username or similar identifier</li>
                  <li><strong>Contact Data:</strong> Email address, telephone numbers, and billing address</li>
                  <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions</li>
                  <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
                  <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us and your communication preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our service</li>
                  <li>To monitor the usage of our service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We have put in place appropriate security measures to prevent your personal data from being 
                  accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit 
                  access to your personal data to those employees, agents, contractors and other third parties 
                  who have a business need to know.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
                <p className="text-muted-foreground">
                  We will only retain your personal data for as long as necessary to fulfill the purposes we 
                  collected it for, including for the purposes of satisfying any legal, accounting, or reporting 
                  requirements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Your Legal Rights</h2>
                <p className="text-muted-foreground mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Request access to your personal data</li>
                  <li>Request correction of your personal data</li>
                  <li>Request erasure of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground">
                  Our website uses cookies to distinguish you from other users of our website. This helps us to 
                  provide you with a good experience when you browse our website and also allows us to improve 
                  our site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Third-Party Links</h2>
                <p className="text-muted-foreground">
                  Our website may include links to third-party websites, plug-ins and applications. Clicking on 
                  those links or enabling those connections may allow third parties to collect or share data about 
                  you. We do not control these third-party websites and are not responsible for their privacy statements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  Email: privacy@ar-ms11.com<br />
                  Phone: +1 (555) 123-4567<br />
                  Address: 123 Analytics Street, San Francisco, CA 94105
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
