import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hidden SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <meta name="description" content="Terms of Service for FluxMail temporary email service and privacy tools. Learn about usage policies, limitations, and user responsibilities." />
        <meta name="keywords" content="temporary email terms, disposable email service terms, tempmail terms of service, email recovery terms, privacy tools terms" />
        <meta name="author" content="FluxMail Team" />
        <meta property="og:title" content="FluxMail Terms of Service - Temporary Email & Privacy Tools" />
        <meta property="og:description" content="Read our comprehensive terms of service for temporary email, email recovery, and privacy protection tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluxmail.dev/terms" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FluxMail Terms of Service" />
        <meta name="twitter:description" content="Terms of service for temporary email and privacy tools." />
        <link rel="canonical" href="https://fluxmail.dev/terms" />
        <meta name="robots" content="index, follow" />
      </div>

      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="card-premium animate-fade-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-lato mb-2">Terms of Service</CardTitle>
              <p className="text-muted-foreground font-ubuntu">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <div className="space-y-6 font-ubuntu">
                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">1. The short version</h2>
                  <p>FluxMail gives you temporary email addresses with no account and no personal data. By using it, you agree to the simple rules below.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">2. What FluxMail does</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Temporary email addresses and an inbox</li>
                    <li>Recovery of an address using a unique ID</li>
                    <li>Privacy-friendly tools for testing and development</li>
                  </ul>
                  <p className="mt-3">Temporary email is provided through external services. We don't run email servers and don't store your messages.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">3. Your responsibilities</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the service lawfully</li>
                    <li>Don't send spam or harass anyone</li>
                    <li>Remember that temporary emails expire — data will be lost</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">4. What's not allowed</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Illegal activity or fraud</li>
                    <li>Spam or unsolicited messages</li>
                    <li>Harassing, threatening, or harming others</li>
                    <li>Abusing or attacking the service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">5. Privacy</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>No sign-up and no personal information needed</li>
                    <li>Temporary data is removed automatically after expiration</li>
                    <li>We don't run our own servers, so we don't log IP addresses</li>
                    <li>Full details are in our Privacy Policy</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">6. What we don't promise</h2>
                  <p>The service is provided "as-is". It may be unavailable from time to time, and temporary emails expire by design. We may change or stop any feature at any time.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">7. Ownership and liability</h2>
                  <p>The FluxMail name and site content belong to FluxMail. To the fullest extent allowed by law, FluxMail isn't responsible for lost data or anything that happens from using the service — you use it at your own risk.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">8. Changes to these terms</h2>
                  <p>We may update these terms. Changes take effect when posted, and continuing to use the service means you accept them.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">9. Where these apply</h2>
                  <p>These terms are governed by the laws of the jurisdiction where FluxMail operates. Answers to other questions are in our FAQ.</p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;