"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Mail, Menu, X, House, Sparkles, HelpCircle, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Default to dark mode
      setIsDark(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: House },
    { name: "Features", href: "/features", icon: Sparkles },
    { name: "Visual", href: "/visual", icon: Workflow },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  return (
    <header className="w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-lato font-bold text-xl">
            <Mail className="h-6 w-6" />
            <span>FluxMail</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-2 text-lg font-ubuntu font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
              />
              <Moon className="h-4 w-4" />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-lg font-ubuntu font-semibold transition-colors hover:text-primary hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
