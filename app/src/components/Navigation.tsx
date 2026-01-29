import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
];

interface NavigationProps {
  onOpenAuth: () => void;
}

export default function Navigation({ onOpenAuth }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isScrolled ? 0 : -100,
        opacity: isScrolled ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isScrolled]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Navigation - appears on scroll */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] opacity-0 -translate-y-full"
      >
        <div className="mx-4 mt-4">
          <div className="glass rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href="#" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-white">
                  Affiliator<span className="text-cyan">.id</span>
                </span>
              </a>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-white/70 hover:text-white transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple to-cyan group-hover:w-full transition-all duration-300" />
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <Button 
                  className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white font-medium px-6"
                  onClick={onOpenAuth}
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mx-4 mt-2">
            <div className="glass rounded-2xl p-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left text-white/70 hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button 
                className="w-full bg-gradient-to-r from-purple to-cyan text-white mt-4"
                onClick={onOpenAuth}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Static Logo for Hero - always visible */}
      <div className="fixed top-6 left-6 z-[90] mix-blend-difference">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white hidden sm:block">
            Affiliator<span className="text-cyan">.id</span>
          </span>
        </a>
      </div>

      {/* Static CTA for Hero - always visible on desktop */}
      <div className="fixed top-6 right-6 z-[90] hidden md:block">
        <Button 
          className="bg-white/10 backdrop-blur hover:bg-white/20 text-white font-medium px-6"
          onClick={onOpenAuth}
        >
          Get Started
        </Button>
      </div>
    </>
  );
}
