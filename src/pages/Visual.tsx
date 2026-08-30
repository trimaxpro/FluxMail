import {
  Globe,
  KeyRound,
  User,
  MousePointerClick,
  Inbox,
  Eye,
  Clock,
  RefreshCw,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface DfdNodeProps {
  icon: LucideIcon;
  title: string;
  sub: string;
}

const Entity = ({ icon: Icon, title, sub }: DfdNodeProps) => (
  <div className="w-full border-2 border-dashed border-muted-foreground/40 rounded-2xl px-5 py-4 bg-muted/30 text-center">
    <Icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
    <div className="font-ubuntu font-semibold">{title}</div>
    <div className="text-xs font-ubuntu text-muted-foreground mt-1">{sub}</div>
  </div>
);

const Process = ({ icon: Icon, title, sub }: DfdNodeProps) => (
  <div className="w-full rounded-full border border-primary/30 bg-primary/5 px-6 py-4 text-center">
    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
    <div className="font-ubuntu font-semibold">{title}</div>
    <div className="text-xs font-ubuntu text-muted-foreground mt-1">{sub}</div>
  </div>
);

const Store = ({ icon: Icon, title, sub }: DfdNodeProps) => (
  <div className="w-full border border-border border-b-4 border-b-primary/50 rounded-xl px-5 py-4 bg-card text-center">
    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
    <div className="font-ubuntu font-semibold">{title}</div>
    <div className="text-xs font-ubuntu text-muted-foreground mt-1">{sub}</div>
  </div>
);

const DownConnector = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center py-1">
    {label && (
      <span className="text-xs font-ubuntu text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full mb-1">
        {label}
      </span>
    )}
    <div className="w-0 h-7 border-l-2 border-dashed border-muted-foreground/40" />
    <ArrowDown className="h-4 w-4 text-muted-foreground/70 -mt-1" />
  </div>
);

const RightConnector = ({ label }: { label?: string }) => (
  <div className="w-full flex items-center gap-2">
    <div className="flex-1 border-t-2 border-dashed border-muted-foreground/40" />
    <ArrowRight className="h-4 w-4 text-muted-foreground/70 shrink-0" />
    {label && (
      <span className="text-xs font-ubuntu text-muted-foreground whitespace-nowrap">{label}</span>
    )}
  </div>
);

const Visual = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hidden SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <meta name="description" content="Visual data flow diagram for FluxMail temporary email service. See how temporary email generation, inbox, expiration, and recovery work." />
        <meta name="keywords" content="temporary email data flow, tempmail diagram, temp mail how it works, email recovery flow" />
        <meta name="author" content="FluxMail Team" />
        <meta property="og:title" content="FluxMail Visual - How Temporary Email Works" />
        <meta property="og:description" content="A visual data flow diagram of how FluxMail temporary email generation, inbox, expiration, and recovery work." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluxmail.dev/visual" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FluxMail Visual - How Temporary Email Works" />
        <meta name="twitter:description" content="See how FluxMail temporary email works in a simple data flow diagram." />
        <link rel="canonical" href="https://fluxmail.dev/visual" />
        <meta name="robots" content="index, follow" />
      </div>

      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="mb-4 font-lato">Visual</h1>
            <p className="text-xl font-ubuntu text-muted-foreground max-w-2xl mx-auto">
              See how FluxMail works at a glance.
            </p>
          </div>

          {/* Data Flow Diagram */}
          <div className="relative border border-muted rounded-3xl p-6 md:p-10 bg-card/50 animate-fade-in">
            <span className="absolute top-4 left-4 text-xs font-ubuntu font-semibold text-muted-foreground uppercase tracking-wider">
              Data Flow Diagram
            </span>
            <span className="absolute top-4 right-4 text-xs font-ubuntu text-muted-foreground">
              DFD · Level 0
            </span>

            <div className="max-w-md mx-auto mt-10 flex flex-col items-center">
              <Entity icon={User} title="You" sub="No sign-up needed" />
              <DownConnector label="Click Generate" />
              <Process icon={MousePointerClick} title="Generate Address" sub="Creates a unique temporary address" />
              <DownConnector label="Address ready" />

              <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:gap-6 items-center">
                <Entity icon={Globe} title="Websites & Forms" sub="Send verification emails" />
                <RightConnector label="send mail" />
                <Store icon={Inbox} title="Temporary Mailbox" sub="Holds messages for ~10 minutes" />
              </div>

              <DownConnector label="Message arrives" />
              <Process icon={Eye} title="Read & Manage" sub="Open, refresh, or delete messages" />
              <DownConnector label="10 minutes pass" />
              <Process icon={Clock} title="Auto-Expire" sub="Mailbox expires to protect privacy" />
              <DownConnector label="ID saved" />
              <Store icon={KeyRound} title="Local Recovery IDs" sub="Stored only in your browser for 24h" />
              <DownConnector label="Need the address back?" />
              <Process icon={RefreshCw} title="Recover" sub="Reuse your ID for 10 more minutes" />

              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <ArrowUp className="h-4 w-4 shrink-0" />
                <span className="text-xs font-ubuntu">Loop back to Generate — same address, fresh timer</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <span className="inline-flex items-center gap-2 text-xs font-ubuntu text-muted-foreground">
                <span className="inline-block w-6 h-4 border-2 border-dashed border-muted-foreground/50 rounded" />
                External entity
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-ubuntu text-muted-foreground">
                <span className="inline-block w-6 h-6 rounded-full border border-primary/40 bg-primary/10" />
                Process
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-ubuntu text-muted-foreground">
                <span className="inline-block w-6 h-5 border border-border border-b-2 border-b-primary/50 rounded-sm" />
                Data store
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-ubuntu text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="w-6 border-t-2 border-dashed border-muted-foreground/50" />
                  <ArrowRight className="h-3 w-3" />
                </span>
                Data flow
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Visual;