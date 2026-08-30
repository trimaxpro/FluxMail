import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How long do temporary emails last?",
      answer: "Your mailbox stays active for 10 minutes by default (extendable to 24 hours). After it expires, the address and its messages aren't deleted instantly — you can still recover them with your recovery ID for a limited time."
    },
    {
      question: "Is registration required?",
      answer: "No registration is required. You can generate temporary email addresses instantly without providing any personal information."
    },
    {
      question: "Can I receive attachments?",
      answer: "Yes, our temporary email service supports attachments. Emails are not deleted the moment they expire — your address and inbox stay recoverable for a while with your recovery ID."
    },
    {
      question: "How many emails can I generate?",
      answer: "There's no limit to the number of temporary email addresses you can generate. Each address is unique and independent."
    },
    {
      question: "Can I forward emails to my real address?",
      answer: "You can copy the content of important emails before they expire. We recommend saving important information locally."
    },
    {
      question: "Is my data secure?",
      answer: "We don't collect any personal information. Be aware that emails are not deleted instantly: temporary mail remains on the service and can be recovered for a limited time using your recovery ID. If privacy matters most, delete messages manually and never send anything sensitive."
    },
    {
      question: "What domains are supported?",
      answer: "We use temporary domains provided by our email service. They rotate automatically to maximize deliverability and avoid blacklisting."
    },
    {
      question: "Can I use this for account verification?",
      answer: "Yes, our temporary emails work perfectly for account verification, newsletter signups, and any other service that requires an email address."
    },
    {
      question: "What if my email expires?",
      answer: "Nothing gets deleted the moment your mail expires. The address and its messages still exist for a while, and you can restore them with your recovery ID: enter it in the 'Recover Expired Mailbox' section and the same address comes back for another active window. Your recovery record is kept in your browser for 24 hours; recovery only stops working once the provider recycles the address."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div style={{ display: 'none' }}>
        <meta name="description" content="Frequently asked questions about FluxMail temporary email service, email recovery, and privacy features. Get instant answers about our secure disposable email service." />
        <meta name="keywords" content="temporary email FAQ, disposable email questions, temp mail help, email privacy FAQ, 10 minute mail, recover expired email, tempmail plus" />
        <meta name="author" content="FluxMail Team" />
        <meta property="og:title" content="FluxMail FAQ - Temporary Email & Recovery Questions" />
        <meta property="og:description" content="Find answers to common questions about temporary email services, email recovery, privacy protection, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluxmail.dev/faq" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FluxMail FAQ - Temporary Email Service Questions" />
        <meta name="twitter:description" content="Get instant answers about temporary email, recovery IDs, and privacy features." />
        <link rel="canonical" href="https://fluxmail.dev/faq" />
        <meta name="robots" content="index, follow" />
      </div>

      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="mb-4 font-lato">Frequently Asked Questions</h1>
            <p className="text-xl font-ubuntu text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our temporary email service, email recovery, and privacy features.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="card-premium animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-lato font-semibold text-lg pr-4">{faq.question}</h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-6 pb-6 animate-slide-up">
                      <p className="font-ubuntu text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
