import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hidden SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <meta name="description" content="Privacy Policy for FluxMail temporary email service and email recovery. Learn how we protect your privacy, handle data, and ensure complete anonymity." />
        <meta name="keywords" content="temporary email privacy, disposable email privacy policy, tempmail privacy, anonymous email service, email recovery privacy, no registration email privacy" />
        <meta name="author" content="FluxMail Team" />
        <meta property="og:title" content="FluxMail Privacy Policy - Complete Privacy Protection" />
        <meta property="og:description" content="Learn how FluxMail protects your privacy with anonymous temporary email services and secure email recovery. No personal data required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluxmail.dev/privacy" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FluxMail Privacy Policy - Anonymous Email Service" />
        <meta name="twitter:description" content="Complete privacy protection with no personal data collection." />
        <link rel="canonical" href="https://fluxmail.dev/privacy" />
        <meta name="robots" content="index, follow" />
      </div>

      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="card-premium animate-fade-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-lato mb-2">Privacy Policy</CardTitle>
              <p className="text-muted-foreground font-ubuntu">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <div className="space-y-6 font-ubuntu">
                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">1. The short version</h2>
                  <p>FluxMail doesn't collect personal information. There's no account, no tracking, and nothing to sign up for. Your email disappears on a timer.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">2. What we never collect</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Names</li>
                    <li>Real email addresses</li>
                    <li>Phone numbers</li>
                    <li>Payment details</li>
                    <li>Browsing history</li>
                    <li>Device fingerprints</li>
                    <li>Advertising or analytics cookies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">3. What happens to your email</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Messages are available only during your active window (10 minutes to 24 hours)</li>
                    <li>Email content is removed automatically after it expires</li>
                    <li>Email addresses are recycled and reused</li>
                    <li>We don't back up or keep copies of your mail</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">4. Email recovery</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Every address gets a unique recovery ID</li>
                    <li>The ID is stored only in your browser</li>
                    <li>Nothing links the ID to your identity</li>
                    <li>Recovery records are removed after 24 hours</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">5. Third-party services</h2>
                  <p className="mb-3">Temporary email is provided through external services. We don't share personal data with them, and their own policies cover the data they process. We use no analytics, advertising, or social integrations.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">6. How we protect your data</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>HTTPS encryption for all communications</li>
                    <li>No permanent storage</li>
                    <li>No user database</li>
                    <li>No server-side copies of your mail</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">7. Your rights</h2>
                  <p>Since we collect nothing, your privacy is protected by default: anonymity, automatic deletion, and the right to be forgotten are all automatic.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">8. Changes to this policy</h2>
                  <p>We may update this page. Changes take effect when posted, and you'll see an updated date at the top.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-lato font-semibold mb-3">9. Questions?</h2>
                  <p>Questions about your privacy? Reach us at privacy@fluxmail.dev.</p>
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

export default Privacy;