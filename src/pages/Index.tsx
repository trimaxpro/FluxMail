import EmailGenerator from "@/components/tempmail/EmailGenerator";
import EmailInbox from "@/components/tempmail/EmailInbox";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="mb-4">FluxMail - Temporary Mail Service</h1>
            <p className="text-xl font-ubuntu text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Generate temporary disposable email addresses instantly. No registration required. 
              Perfect for testing, privacy, and avoiding spam. Extend to 24 hours when needed.
            </p>
          </div>

          {/* Email Generator */}
          <div className="mb-8 max-w-2xl mx-auto animate-slide-up">
            <EmailGenerator />
          </div>

          {/* Email Inbox */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <EmailInbox />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
