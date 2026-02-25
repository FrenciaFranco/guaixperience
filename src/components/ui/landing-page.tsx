"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";
import guaiLogo from "../../../images/ChatGPT Image 24 feb 2026, 11_05_08 p.m..png";

// Reusable ScrollGlobe component following shadcn/ui patterns
interface ScrollGlobeProps {
  sections: {
    id: string;
    badge?: string;
    title: string;
    subtitle?: string;
    description: string;
    helperText?: string;
    align?: 'left' | 'center' | 'right';
    features?: { title: string; description: string }[];
    actions?: { label: string; variant: 'primary' | 'secondary'; onClick?: () => void }[];
    location?: {
      title: string;
      address: string;
      mapEmbedUrl: string;
      mapsUrl: string;
    };
    contactIntro?: string;
    contactActions?: {
      id: "whatsapp" | "call" | "instagram";
      label: string;
      value: string;
      href: string;
      external?: boolean;
    }[];
  }[];
  className?: string;
}

// Lerp utility for smooth interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const getResponsiveScissorsStyle = (width: number) => {
  if (width < 640) {
    return { top: 38, left: 47, scale: 1.42 };
  }
  if (width < 1024) {
    return { top: 37, left: 45, scale: 1.3 };
  }
  if (width < 1440) {
    return { top: 36, left: 42, scale: 1.18 };
  }
  return { top: 35, left: 40, scale: 1.08 };
};

const contactIconClassName = "h-5 w-5 text-primary";

function ContactActionIcon({ id }: { id: "whatsapp" | "call" | "instagram" }) {
  if (id === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={contactIconClassName} aria-hidden="true">
        <path d="M12.04 2.5c-5.24 0-9.49 4.25-9.49 9.49 0 1.83.52 3.61 1.49 5.14L2.5 21.5l4.48-1.48a9.44 9.44 0 0 0 5.06 1.47h.01c5.24 0 9.49-4.25 9.49-9.49S17.29 2.5 12.04 2.5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.54 7.9c-.24.01-.5.1-.67.34-.2.29-.52.83-.52 2.01s.86 2.32.98 2.48c.12.16 1.68 2.68 4.17 3.65 2.07.8 2.5.64 2.95.6.45-.04 1.45-.59 1.65-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28-.25-.12-1.45-.71-1.68-.79-.22-.08-.39-.12-.55.12-.16.25-.62.79-.76.95-.14.16-.28.18-.53.06-.25-.12-1.06-.39-2.01-1.25-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.76-1.81-.2-.47-.4-.41-.55-.41h-.47Z" fill="currentColor" />
      </svg>
    );
  }

  if (id === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={contactIconClassName} aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.25" cy="6.75" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={contactIconClassName} aria-hidden="true">
      <path d="M6.7 3.5h3.6l1.8 4.44-2.34 1.86a14.84 14.84 0 0 0 4.45 4.45l1.86-2.34 4.44 1.8v3.6a1.7 1.7 0 0 1-1.7 1.7C10.77 19 5 13.23 5 6.2a1.7 1.7 0 0 1 1.7-1.7Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ScrollGlobe({ sections, className }: ScrollGlobeProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scissorsAngle, setScissorsAngle] = useState(-24);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const currentStyle = useRef({ top: 36, left: 40, scale: 1.1 });
  const responsiveBaseStyle = useRef({ top: 36, left: 42, scale: 1.18 });

  useEffect(() => {
    const updateResponsiveStyle = () => {
      const next = getResponsiveScissorsStyle(window.innerWidth);
      responsiveBaseStyle.current = next;
      currentStyle.current = next;
      if (globeRef.current) {
        globeRef.current.style.transform = `translate(${next.left - 50}vw, ${next.top - 50}vh) scale(${next.scale})`;
      }
    };

    updateResponsiveStyle();
    window.addEventListener("resize", updateResponsiveStyle);
    return () => window.removeEventListener("resize", updateResponsiveStyle);
  }, []);

  // Smooth animation loop
  useEffect(() => {
    let targetStyle = responsiveBaseStyle.current;
    let targetOpacity = 0.85;
    let targetAngle = -24;
    let running = true;
    let lastActiveSection = -1;

    const updateTarget = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const containerHeight = containerRect?.height ?? document.documentElement.scrollHeight;
      const totalScrollable = Math.max(containerHeight - window.innerHeight, 1);
      const containerTop = containerRect?.top ?? 0;
      const currentScroll = Math.min(Math.max(-containerTop, 0), totalScrollable);
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);

      setScrollProgress(progress);

      const maxIndex = Math.max(sections.length - 1, 1);
      const sectionProgress = progress * maxIndex;
      const fromIndex = Math.floor(sectionProgress);
      const toIndex = Math.min(fromIndex + 1, maxIndex);
      const blend = sectionProgress - fromIndex;

      const base = responsiveBaseStyle.current;
      const bobY = Math.sin(progress * Math.PI * 2) * 1.2;
      const bobX = Math.cos(progress * Math.PI * 2) * 0.9;
      const pulse = Math.sin(progress * Math.PI) * 0.04;

      targetStyle = {
        top: base.top + bobY,
        left: base.left + bobX,
        scale: base.scale + pulse,
      };

      const fromAngle = fromIndex % 2 === 0 ? -24 : 24;
      const toAngle = toIndex % 2 === 0 ? -24 : 24;
      const swingDirection = toAngle >= fromAngle ? 1 : -1;
      const swing = Math.sin(blend * Math.PI) * 8 * swingDirection;
      targetAngle = lerp(fromAngle, toAngle, blend) + swing;
      setScissorsAngle((prev) => (Math.abs(prev - targetAngle) > 0.1 ? targetAngle : prev));

      targetOpacity = progress > 0.75
        ? lerp(0.85, 0.4, (progress - 0.75) / 0.25)
        : 0.85;

      const nextActiveSection = Math.round(sectionProgress);
      if (nextActiveSection !== lastActiveSection) {
        lastActiveSection = nextActiveSection;
        setActiveSection(nextActiveSection);
      }
    };

    const animate = () => {
      if (!running) return;
      const smoothing = 0.06;
      currentStyle.current = {
        top: lerp(currentStyle.current.top, targetStyle.top, smoothing),
        left: lerp(currentStyle.current.left, targetStyle.left, smoothing),
        scale: lerp(currentStyle.current.scale, targetStyle.scale, smoothing),
      };

      if (globeRef.current) {
        globeRef.current.style.transform = `translate(${currentStyle.current.left - 50}vw, ${currentStyle.current.top - 50}vh) scale(${currentStyle.current.scale})`;
        globeRef.current.style.opacity = `${targetOpacity}`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    updateTarget();
    animate();

    return () => {
      running = false;
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("scroll", updateTarget);
    };
  }, [sections.length]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full max-w-screen overflow-x-hidden min-h-screen bg-background text-foreground",
        className
      )}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-border/20 via-border/40 to-border/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary via-blue-600 to-blue-900 will-change-transform shadow-sm"
          style={{ 
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: 'left center',
            transition: 'transform 0.15s ease-out',
            filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.3))'
          }}
        />
      </div>

      {/* Enhanced Navigation with auto-hiding labels - Fully Responsive */}
      <div className="hidden sm:flex fixed right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="relative group">
              {/* Auto-hiding section label - Always visible but with responsive sizing */}
              <div
                className={cn(
                  "nav-label absolute right-5 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2",
                  "px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap",
                  "bg-background/95 backdrop-blur-md border border-border/60 shadow-xl z-50",
                  activeSection === index ? "animate-fadeOut" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  <div className="w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs sm:text-sm lg:text-base">
                    {section.badge || `Section ${index + 1}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
                className={cn(
                  "relative w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125",
                  "before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300",
                  activeSection === index 
                    ? "bg-primary border-primary shadow-lg before:animate-ping before:bg-primary/20" 
                    : "bg-transparent border-muted-foreground/40 hover:border-primary/60 hover:bg-primary/10"
                )}
                aria-label={`Go to ${section.badge || `section ${index + 1}`}`}
              />
            </div>
          ))}
        </div>
        
        {/* Enhanced navigation line - Responsive */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 lg:w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2 -z-10" />
      </div>

      {/* Ultra-smooth scissors with full-viewport canvas */}
      <div
        ref={globeRef}
        className="fixed inset-0 z-10 pointer-events-none overflow-visible will-change-transform"
        style={{ opacity: 0.85 }}
      >
        <Globe className="w-full h-full" angle={scissorsAngle} />
      </div>

      <div className="fixed inset-0 z-[15] pointer-events-none bg-black/8" />
      <div className="fixed inset-0 z-[16] pointer-events-none bg-[radial-gradient(ellipse_at_22%_32%,rgba(255,255,255,0.04),rgba(10,12,24,0.12)_58%,rgba(6,8,18,0.2)_100%)]" />

      {/* Dynamic sections - fully responsive */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          ref={(el) => { sectionRefs.current[index] = el; }}
          className={cn(
            "relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 z-20 py-12 sm:py-16 lg:py-20",
            "w-full max-w-full overflow-hidden",
            section.align === 'center' && "items-center text-center",
            section.align === 'right' && "items-end text-right",
            section.align !== 'center' && section.align !== 'right' && "items-start text-left"
          )}
        >
          <div className={cn(
            "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl will-change-transform transition-all duration-700",
            "rounded-2xl sm:rounded-3xl bg-white/[0.04] backdrop-blur-md px-5 sm:px-7 md:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
            "opacity-100 translate-y-0"
          )}>
            {index === 0 ? (
              <div className="mb-6 sm:mb-8 flex justify-center">
                <Image
                  src={guaiLogo}
                  alt="GUAI XPERIENCE logo"
                  priority
                  className="h-auto w-[170px] sm:w-[210px] lg:w-[240px] drop-shadow-[0_6px_16px_rgba(0,0,0,0.28)]"
                />
              </div>
            ) : (
              <h1 className={cn(
                "w-full text-center font-[family-name:var(--font-montserrat)] font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]",
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
              )}>
                {section.subtitle ? (
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-white">{section.title}</div>
                    <div className="text-white/75 text-[0.6em] sm:text-[0.7em] font-medium tracking-wider">{section.subtitle}</div>
                  </div>
                ) : (
                  <span className="text-white">{section.title}</span>
                )}
              </h1>
            )}
            {section.location && section.contactActions ? (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
                  <div className="rounded-xl sm:rounded-2xl border border-border/55 bg-background/35 p-4 sm:p-5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{section.location.title}</h3>
                    <p className="mt-2 text-sm sm:text-base text-white/80">{section.location.address}</p>
                    <div className="mt-4 overflow-hidden rounded-lg sm:rounded-xl border border-border/50 bg-black/30">
                      <iframe
                        src={section.location.mapEmbedUrl}
                        title="GUAI XPERIENCE location map"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-44 w-full sm:h-52"
                      />
                    </div>
                    <a
                      href={section.location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/35"
                      aria-label="Open GUAI XPERIENCE in Google Maps"
                    >
                      Open in Maps
                    </a>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-border/55 bg-background/35 p-4 sm:p-5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Contact</h3>
                    {section.contactIntro && (
                      <p className="mt-2 text-sm text-white/72">{section.contactIntro}</p>
                    )}
                    <div className="mt-4 space-y-3">
                      {section.contactActions.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          aria-label={`${item.label}: ${item.value}`}
                          className="group flex min-h-14 items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/45 px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/35 bg-primary/10">
                              <ContactActionIcon id={item.id} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-[0.14em] text-white/58">{item.label}</p>
                              <p className="truncate text-sm sm:text-[15px] text-white/90">{item.value}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary/90 transition-colors group-hover:text-primary">
                            Open
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn(
                "font-[family-name:var(--font-inter)] text-white/92 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
                section.align === 'center' ? "max-w-full mx-auto text-center" : "max-w-full"
              )}>
                <p className="mb-3 sm:mb-4 whitespace-pre-line">{section.description}</p>
                {index === 0 && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground/60 mt-4 sm:mt-6">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                      <span>Sensory Barbershop</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <span>Scroll to Discover</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Features - Responsive grid */}
            {section.features && (
              <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-10">
                {section.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "group p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
                      "hover:border-primary/20 hover:-translate-y-1"
                    )}
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary/60 mt-1.5 sm:mt-2 group-hover:bg-primary transition-colors flex-shrink-0" />
                      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                        <h3 className="font-semibold text-card-foreground text-base sm:text-lg">{feature.title}</h3>
                        <p className="text-muted-foreground/80 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Actions - Responsive buttons */}
            {section.actions && (
              <div>
                <div className={cn(
                  "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4",
                  section.align === 'center' && "justify-center",
                  section.align === 'right' && "justify-end",
                  (!section.align || section.align === 'left') && "justify-start"
                )}>
                  {section.actions.map((action, actionIndex) => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={cn(
                        "group relative px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base",
                        "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto",
                        action.variant === 'primary' 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30" 
                          : "border-2 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 text-foreground"
                      )}
                      style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                    >
                      <span className="relative z-10">{action.label}</span>
                      {action.variant === 'primary' && (
                        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </button>
                  ))}
                </div>
                {section.helperText && (
                  <p className={cn(
                    "mt-3 text-xs sm:text-sm text-muted-foreground/70",
                    section.align === 'center' && "text-center",
                    section.align === 'right' && "text-right"
                  )}>
                    {section.helperText}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// Demo component showcasing the ScrollGlobe
export default function GlobeScrollDemo() {
  const demoSections = [
    {
      id: "hero",
      badge: "Welcome",
      title: "Welcome to GUAI XPERIENCE",
      description: "This is more than a haircut. It is a sensory barbershop ritual where style, self-care, and calm come together so you can slow down, reconnect, and leave renewed.",
      align: "left" as const,
      actions: [
        { label: "Book Now", variant: "primary" as const, onClick: () => window.open("https://connect.shore.com/bookings/guai-xperience-70005040-06e6-4d38-9633-6d5187dc93d5/services?locale=es", "_blank", "noopener,noreferrer") },
        { label: "Learn More", variant: "secondary" as const, onClick: () => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
      ]
    },
    {
      id: "experience",
      badge: "Experience",
      title: "The GUAI Experience",
      description: "Every appointment is designed around you. We combine precise technique, thoughtful conversation, and a relaxing atmosphere inspired by natural textures, aromas, and rhythm.",
      align: "left" as const,
      features: [
        { title: "Personalized Attention", description: "We tailor every cut, beard service, and finish to your style, routine, and personality." },
        { title: "Sensory Atmosphere", description: "Light, sound, and scent are curated to help you disconnect from the rush and feel present." },
        { title: "Premium Grooming", description: "From consultation to final detail, our craft is precise, modern, and consistently high-end." }
      ]
    },
    {
      id: "visit",
      badge: "Contact",
      title: "Visit Us in Barcelona",
      description: "",
      align: "left" as const,
      location: {
        title: "Find Us",
        address: "C. Llull 82, Barcelona",
        mapEmbedUrl: "https://www.google.com/maps?q=C.%20Llull%2082%2C%20Barcelona&output=embed",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=C.+Llull+82,+Barcelona"
      },
      contactIntro: "Questions or bookings? Reach us directly.",
      contactActions: [
        {
          id: "whatsapp",
          label: "WhatsApp",
          value: "654 823 296",
          href: "https://wa.me/34654823296",
          external: true
        },
        {
          id: "call",
          label: "Call",
          value: "931 286 182",
          href: "tel:+34931286182"
        },
        {
          id: "instagram",
          label: "Instagram",
          value: "@guaixperience",
          href: "https://www.instagram.com/guaixperience",
          external: true
        }
      ]
    },
    {
      id: "booking",
      badge: "Booking",
      title: "Book Your Appointment",
      description: "Choose your service and reserve your spot online in just a few steps. Quick, clear, and ready when you are.",
      align: "center" as const,
      actions: [
        { label: "Book Now", variant: "primary" as const, onClick: () => window.open("https://connect.shore.com/bookings/guai-xperience-70005040-06e6-4d38-9633-6d5187dc93d5/services?locale=es", "_blank", "noopener,noreferrer") }
      ],
      helperText: "Fast and secure online booking"
    }
  ];

  return (
    <ScrollGlobe 
      sections={demoSections}
      className="bg-gradient-to-br from-background via-muted/20 to-background"
    />
  );
}
