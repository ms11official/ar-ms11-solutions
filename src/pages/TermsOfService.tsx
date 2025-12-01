import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground">Last Updated: December 1, 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using AR-MS11's services, you agree to be bound by these Terms of Service and 
                  all applicable laws and regulations. If you do not agree with any of these terms, you are 
                  prohibited from using or accessing our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                <p className="text-muted-foreground mb-4">
                  Permission is granted to temporarily access the materials (information or software) on AR-MS11's 
                  platform for personal, non-commercial transitory viewing only. This is the grant of a license, 
                  not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or public display</li>
                  <li>Attempt to reverse engineer any software contained on AR-MS11's platform</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground">
                  When you create an account with us, you must provide information that is accurate, complete, and 
                  current at all times. Failure to do so constitutes a breach of the Terms, which may result in 
                  immediate termination of your account. You are responsible for safeguarding the password that you 
                  use to access the service and for any activities or actions under your password.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Service Description</h2>
                <p className="text-muted-foreground">
                  AR-MS11 provides marketing analytics tools and services. We reserve the right to modify, suspend, 
                  or discontinue any aspect of the service at any time, with or without notice. We will not be 
                  liable to you or to any third party for any modification, suspension, or discontinuance of the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The service and its original content, features, and functionality are and will remain the exclusive 
                  property of AR-MS11 and its licensors. The service is protected by copyright, trademark, and other 
                  laws. Our trademarks may not be used in connection with any product or service without the prior 
                  written consent of AR-MS11.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Payment and Billing</h2>
                <p className="text-muted-foreground mb-4">
                  For paid services, you agree to pay all fees and charges in accordance with the pricing and payment 
                  terms in effect at the time. All fees are non-refundable unless otherwise stated. We reserve the 
                  right to change our pricing at any time with 30 days notice.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Prohibited Uses</h2>
                <p className="text-muted-foreground mb-4">You may not use our service:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of the service</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  In no event shall AR-MS11, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential or punitive damages, including without 
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
                  access to or use of or inability to access or use the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any 
                  reason whatsoever, including without limitation if you breach the Terms. Upon termination, your 
                  right to use the service will immediately cease.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed and construed in accordance with the laws of California, United States, 
                  without regard to its conflict of law provisions. Our failure to enforce any right or provision of 
                  these Terms will not be considered a waiver of those rights.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
                  revision is material, we will try to provide at least 30 days notice prior to any new terms taking 
                  effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  Email: legal@ar-ms11.com<br />
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

export default TermsOfService;
