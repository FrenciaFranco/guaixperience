"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Globe from "@/components/ui/globe";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import { TESTIMONIALS_BY_LANGUAGE, type TestimonialItem } from "@/data/testimonials";
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
    testimonials?: {
      quote: string;
      name: string;
      designation: string;
      src: string;
    }[];
  }[];
  uiText: {
    openInMaps: string;
    contactTitle: string;
    openAction: string;
    sensoryLabel: string;
    scrollLabel: string;
    goToSection: string;
  };
  className?: string;
}

// Lerp utility for smooth interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const getResponsiveScissorsStyle = (width: number) => {
  if (width < 640) {
    return { top: 38, left: 47, scale: 1.42 };
  }
  if (width < 1024) {
    return { top: 38, left: 47, scale: 1.42 };
  }
  // Desktop: no CSS scale needed — model is scaled in Three.js
  return { top: 50, left: 80, scale: 1 };
};

type TestimonialsByLanguage = Record<"en" | "es" | "ca", TestimonialItem[]>;

const isTestimonialItem = (value: unknown): value is TestimonialItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.quote === "string" &&
    typeof item.name === "string" &&
    typeof item.designation === "string" &&
    typeof item.src === "string"
  );
};

const isTestimonialsByLanguage = (value: unknown): value is TestimonialsByLanguage => {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  const keys: Array<keyof TestimonialsByLanguage> = ["en", "es", "ca"];
  return keys.every((key) => Array.isArray(data[key]) && data[key].every(isTestimonialItem));
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

function ScrollGlobe({ sections, uiText, className }: ScrollGlobeProps) {
  const resolvedUiText = uiText ?? {
    openInMaps: "Open in Maps",
    contactTitle: "Contact",
    openAction: "Open",
    sensoryLabel: "Sensory Barbershop",
    scrollLabel: "Scroll to Discover",
    goToSection: "Go to",
  };
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scissorsAngle, setScissorsAngle] = useState(-24);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const currentStyle = useRef({ top: 38, left: 47, scale: 1.42 });
  const responsiveBaseStyle = useRef({ top: 38, left: 47, scale: 1.42 });
  const scrollProgressRef = useRef(0);
  const scissorsAngleRef = useRef(-24);

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

      if (Math.abs(progress - scrollProgressRef.current) > 0.012) {
        scrollProgressRef.current = progress;
        setScrollProgress(progress);
      }

      const maxIndex = Math.max(sections.length - 1, 1);
      const sectionProgress = progress * maxIndex;
      const fromIndex = Math.floor(sectionProgress);
      const toIndex = Math.min(fromIndex + 1, maxIndex);
      const blend = sectionProgress - fromIndex;

      const base = responsiveBaseStyle.current;
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        // Desktop: scissors sits on one side per section, alternates on section change
        const leftPos = 18;
        const rightPos = 82;
        const fromSide = fromIndex % 2 === 0 ? rightPos : leftPos;
        const toSide = toIndex % 2 === 0 ? rightPos : leftPos;
        const currentLeft = lerp(fromSide, toSide, blend);
        targetStyle = {
          top: base.top,
          left: currentLeft,
          scale: base.scale,
        };
      } else {
        const bobY = Math.sin(progress * Math.PI * 2) * 1.2;
        const bobX = Math.cos(progress * Math.PI * 2) * 0.9;
        const pulse = Math.sin(progress * Math.PI) * 0.04;
        targetStyle = {
          top: base.top + bobY,
          left: base.left + bobX,
          scale: base.scale + pulse,
        };
      }

      const fromAngle = fromIndex % 2 === 0 ? -24 : 24;
      const toAngle = toIndex % 2 === 0 ? -24 : 24;
      const swingDirection = toAngle >= fromAngle ? 1 : -1;
      const swing = Math.sin(blend * Math.PI) * 8 * swingDirection;
      targetAngle = lerp(fromAngle, toAngle, blend) + swing;
      if (Math.abs(targetAngle - scissorsAngleRef.current) > 0.6) {
        scissorsAngleRef.current = targetAngle;
        setScissorsAngle(targetAngle);
      }

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
                type="button"
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
                className={cn(
                  "relative w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125 cursor-pointer",
                  "before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300",
                  activeSection === index 
                    ? "bg-primary border-primary shadow-lg before:animate-ping before:bg-primary/20" 
                    : "bg-transparent border-muted-foreground/40 hover:border-primary/60 hover:bg-primary/10"
                )}
                aria-label={`${resolvedUiText.goToSection} ${section.badge || `section ${index + 1}`}`}
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
        className="fixed inset-0 z-30 pointer-events-none overflow-visible will-change-transform"
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
            "relative flex flex-col justify-start px-4 sm:px-6 md:px-8 lg:px-12 z-20 py-8 sm:py-10 lg:py-12 min-h-[auto]",
            "w-full max-w-full overflow-hidden",
            "items-center text-center"
          )}
        >
          <div className={cn(
            "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl will-change-transform transition-all duration-700",
            "rounded-2xl sm:rounded-3xl bg-white/[0.04] backdrop-blur-md px-4 sm:px-7 md:px-8 lg:px-10 py-5 sm:py-6 lg:py-7 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
            "opacity-100 translate-y-0"
          )}>
            {index === 0 ? (
              <div className="mb-1 sm:mb-8 flex justify-center">
                <Image
                  src={guaiLogo}
                  alt="GUAI XPERIENCE logo"
                  priority
                  className="h-auto w-[340px] sm:w-[420px] lg:w-[480px] drop-shadow-[0_6px_16px_rgba(0,0,0,0.28)]"
                />
              </div>
            ) : (
              <h1 className={cn(
                "w-full text-center font-[family-name:var(--font-montserrat)] font-bold mb-6 sm:mb-6 leading-[1.1] tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]",
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
            {section.testimonials ? (
              <div className="flex justify-center">
                <div className="w-full max-w-[1456px] rounded-2xl border border-border/55 bg-background/35 p-3 sm:p-6 lg:p-10 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                  {Math.abs(activeSection - index) <= 1 ? (
                    <CircularTestimonials
                      testimonials={section.testimonials}
                      autoplay={true}
                      colors={{
                        name: "#f7f7ff",
                        designation: "rgba(247,247,255,0.72)",
                        testimony: "rgba(247,247,255,0.9)",
                        arrowBackground: "rgba(10,14,28,0.75)",
                        arrowForeground: "#f1f1f7",
                        arrowHoverBackground: "#0582CA",
                      }}
                    fontSizes={{
                      name: "clamp(1.65rem, 5.8vw, 1.95rem)",
                      designation: "clamp(1rem, 3.9vw, 1.25rem)",
                      quote: "clamp(1.08rem, 3.9vw, 1.25rem)",
                    }}
                  />
                ) : (
                    <div className="h-[420px] w-full rounded-2xl bg-black/10" />
                  )}
                </div>
              </div>
            ) : section.location && section.contactActions ? (
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
                      className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/35"
                      aria-label="Open GUAI XPERIENCE in Google Maps"
                    >
                      {resolvedUiText.openInMaps}
                    </a>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-border/55 bg-background/35 p-4 sm:p-5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{resolvedUiText.contactTitle}</h3>
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
                          className="group flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/45 px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                            {resolvedUiText.openAction}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn(
                "font-[family-name:var(--font-inter)] text-white/92 leading-[1.45] sm:leading-relaxed mb-5 sm:mb-10 text-[15px] sm:text-lg lg:text-xl font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
                section.align === 'center' ? "max-w-full mx-auto text-center" : "max-w-full"
              )}>
                <p className="mb-3 sm:mb-4 whitespace-pre-line">{section.description}</p>
                {index === 0 && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground/60 mt-4 sm:mt-6">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                      <span>{resolvedUiText.sensoryLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <span>{resolvedUiText.scrollLabel}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Features - Responsive grid */}
            {section.features && (
              <div className="grid gap-2.5 sm:gap-4 mb-5 sm:mb-10">
                {section.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "group p-3 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
                      "hover:border-primary/20 hover:-translate-y-1"
                    )}
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-4">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary/60 mt-1.5 sm:mt-2 group-hover:bg-primary transition-colors flex-shrink-0" />
                      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                        <h3 className="font-semibold text-card-foreground text-[1.03rem] sm:text-lg">{feature.title}</h3>
                        <p className="text-muted-foreground/80 leading-[1.45] sm:leading-relaxed text-[0.97rem] sm:text-base">{feature.description}</p>
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
                      type="button"
                      onClick={action.onClick}
                      className={cn(
                        "group relative cursor-pointer px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base",
                        "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto",
                        action.variant === 'primary' 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30" 
                          : "border-2 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 text-foreground"
                      )}
                      style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                    >
                      <span className="relative z-10">{action.label}</span>
                      {action.variant === 'primary' && (
                        <div className="pointer-events-none absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

type Language = "en" | "es" | "ca";

const BOOKING_URL = "https://connect.shore.com/bookings/guai-xperience-70005040-06e6-4d38-9633-6d5187dc93d5/services?locale=es";

// Demo component showcasing the ScrollGlobe
export default function GlobeScrollDemo() {
  const [language, setLanguage] = useState<Language>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [testimonialsByLanguage, setTestimonialsByLanguage] = useState<TestimonialsByLanguage>(
    TESTIMONIALS_BY_LANGUAGE
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadTestimonials = async () => {
      try {
        const response = await fetch("/testimonials/content.json", { cache: "no-store" });
        if (!response.ok) return;
        const data: unknown = await response.json();
        if (mounted && isTestimonialsByLanguage(data)) {
          setTestimonialsByLanguage(data);
        }
      } catch {
        // Keep local fallback testimonials when JSON is not available.
      }
    };

    loadTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  const baseSections: ScrollGlobeProps["sections"] = [
    {
      id: "hero",
      badge: "Welcome",
      title: "Welcome to GUAI XPERIENCE",
      description: "This is more than a haircut. It is a sensory barbershop ritual where style, self-care, and calm come together so you can slow down, reconnect, and leave renewed.",
      align: "left",
      actions: [
        { label: "Book Now", variant: "primary", onClick: () => window.open(BOOKING_URL, "_blank", "noopener,noreferrer") },
        { label: "Learn More", variant: "secondary", onClick: () => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
      ],
    },
    {
      id: "experience",
      badge: "Experience",
      title: "The GUAI Experience",
      description: "Every appointment is designed around you. We combine precise technique, thoughtful conversation, and a relaxing atmosphere inspired by natural textures, aromas, and rhythm.",
      align: "left",
      features: [
        { title: "Personalized Attention", description: "We tailor every cut, beard service, and finish to your style, routine, and personality." },
        { title: "Sensory Atmosphere", description: "Light, sound, and scent are curated to help you disconnect from the rush and feel present." },
        { title: "Premium Grooming", description: "From consultation to final detail, our craft is precise, modern, and consistently high-end." },
      ],
    },
    {
      id: "visit",
      badge: "Contact",
      title: "Visit Us in Barcelona",
      description: "",
      align: "left",
      location: {
        title: "Find Us",
        address: "C. Llull 82, Barcelona",
        mapEmbedUrl: "https://www.google.com/maps?q=C.%20Llull%2082%2C%20Barcelona&output=embed",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=C.+Llull+82,+Barcelona",
      },
      contactIntro: "Questions or bookings? Reach us directly.",
      contactActions: [
        { id: "whatsapp", label: "WhatsApp", value: "654 823 296", href: "https://wa.me/34654823296", external: true },
        { id: "call", label: "Call", value: "931 286 182", href: "tel:+34931286182" },
        { id: "instagram", label: "Instagram", value: "@guaixperience", href: "https://www.instagram.com/guaixperience", external: true },
      ],
    },
    {
      id: "booking",
      badge: "Booking",
      title: "Book Your Appointment",
      description: "Choose your service and reserve your spot online in just a few steps. Quick, clear, and ready when you are.",
      align: "center",
      actions: [{ label: "Book Now", variant: "primary", onClick: () => window.open(BOOKING_URL, "_blank", "noopener,noreferrer") }],
      helperText: "Fast and secure online booking",
    },
    {
      id: "testimonials",
      badge: "Testimonials",
      title: "What Clients Say",
      description: "",
      align: "center",
      testimonials: testimonialsByLanguage.en,
    },
  ];

  const localizedSections: Record<Language, ScrollGlobeProps["sections"]> = {
    en: baseSections,
    es: [
      {
        ...baseSections[0],
        badge: "Bienvenida",
        title: "Bienvenido a GUAI XPERIENCE",
        description: "Esto es mas que un corte. Es un ritual de barberia sensorial donde estilo, autocuidado y calma se unen para que bajes el ritmo, reconectes y salgas renovado.",
        actions: [
          { label: "Reservar", variant: "primary", onClick: () => window.open(BOOKING_URL, "_blank", "noopener,noreferrer") },
          { label: "Saber mas", variant: "secondary", onClick: () => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
        ],
      },
      {
        ...baseSections[1],
        badge: "Experiencia",
        title: "La Experiencia GUAI",
        description: "Cada cita esta disenada alrededor de ti. Combinamos tecnica precisa, conversacion cuidada y un ambiente relajante inspirado en texturas, aromas y ritmo natural.",
        features: [
          { title: "Atencion personalizada", description: "Adaptamos cada corte, arreglo de barba y acabado a tu estilo, rutina y personalidad." },
          { title: "Ambiente sensorial", description: "Luz, sonido y aroma se cuidan para ayudarte a desconectar del ritmo diario y estar presente." },
          { title: "Grooming premium", description: "Desde la consulta hasta el ultimo detalle, nuestro trabajo es preciso, moderno y de alto nivel." },
        ],
      },
      {
        ...baseSections[2],
        badge: "Contacto",
        title: "Visitanos en Barcelona",
        location: {
          title: "Donde estamos",
          address: "C. Llull 82, Barcelona",
          mapEmbedUrl: "https://www.google.com/maps?q=C.%20Llull%2082%2C%20Barcelona&output=embed",
          mapsUrl: "https://www.google.com/maps/search/?api=1&query=C.+Llull+82,+Barcelona",
        },
        contactIntro: "Dudas o reservas? Escribenos directamente.",
        contactActions: [
          { id: "whatsapp", label: "WhatsApp", value: "654 823 296", href: "https://wa.me/34654823296", external: true },
          { id: "call", label: "Llamar", value: "931 286 182", href: "tel:+34931286182" },
          { id: "instagram", label: "Instagram", value: "@guaixperience", href: "https://www.instagram.com/guaixperience", external: true },
        ],
      },
      {
        ...baseSections[3],
        badge: "Reserva",
        title: "Reserva tu cita",
        description: "Elige tu servicio y reserva online en pocos pasos. Rapido, claro y listo cuando tu quieras.",
        actions: [{ label: "Reservar ahora", variant: "primary", onClick: () => window.open(BOOKING_URL, "_blank", "noopener,noreferrer") }],
        helperText: "Reserva online rapida y segura",
      },
      {
        ...baseSections[4],
        badge: "Resenas",
        title: "Lo que dicen nuestros clientes",
        testimonials: testimonialsByLanguage.es,
      },
    ],
    ca: [
      {
        ...baseSections[0],
        badge: "Benvinguda",
        title: "Benvingut a GUAI XPERIENCE",
        description: "Aixo es mes que un tall de cabell. Es un ritual de barberia sensorial on estil, autocura i calma s'uneixen perque puguis baixar el ritme, reconnectar i sortir renovat.",
        actions: [
          { label: "Reserva", variant: "primary", onClick: () => window.open(BOOKING_URL, "_blank", "noopener,noreferrer") },
          { label: "Saber-ne mes", variant: "secondary", onClick: () => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
        ],
      },
      {
        ...baseSections[1],
        badge: "Experiencia",
        title: "L'Experiencia GUAI",
        description: "Cada cita esta dissenyada al teu voltant. Combinem tecnica precisa, conversa cuidada i una atmosfera relaxant inspirada en textures, aromes i ritme natural.",
        features: [
          { title: "Atencio personalitzada", description: "Adaptem cada tall, servei de barba i acabat al teu estil, rutina i personalitat." },
          { title: "Atmosfera sensorial", description: "La llum, el so i l'aroma es cuiden per ajudar-te a desconnectar del ritme diari i estar present." },
          { title: "Grooming premium", description: "Des de la consulta fins a l'ultim detall, el nostre treball es precis, modern i d'alt nivell." },
        ],
      },
      {
        ...baseSections[2],
        badge: "Contacte",
        title: "Visita'ns a Barcelona",
        location: {
          title: "On som",
          address: "C. Llull 82, Barcelona",
          mapEmbedUrl: "https://www.google.com/maps?q=C.%20Llull%2082%2C%20Barcelona&output=embed",
          mapsUrl: "https://www.google.com/maps/search/?api=1&query=C.+Llull+82,+Barcelona",
        },
        contactIntro: "Dubtes o reserves? Escriu-nos directament.",
        contactActions: [
          { id: "whatsapp", label: "WhatsApp", value: "654 823 296", href: "https://wa.me/34654823296", external: true },
          { id: "call", label: "Trucar", value: "931 286 182", href: "tel:+34931286182" },
          { id: "instagram", label: "Instagram", value: "@guaixperience", href: "https://www.instagram.com/guaixperience", external: true },
        ],
      },
      {
        ...baseSections[3],
        badge: "Reserva",
        title: "Reserva la teva cita",
        description: "Tria el teu servei i reserva online en pocs passos. Rapid, clar i preparat quan tu vulguis.",
        actions: [{ label: "Reserva ara", variant: "primary", onClick: () => window.open(BOOKING_URL, "_blank", "noopener,noreferrer") }],
        helperText: "Reserva online rapida i segura",
      },
      {
        ...baseSections[4],
        badge: "Ressenyes",
        title: "Que diuen els clients",
        testimonials: testimonialsByLanguage.ca,
      },
    ],
  };

  const uiByLanguage: Record<Language, ScrollGlobeProps["uiText"]> = {
    en: {
      openInMaps: "Open in Maps",
      contactTitle: "Contact",
      openAction: "Open",
      sensoryLabel: "Sensory Barbershop",
      scrollLabel: "Scroll to Discover",
      goToSection: "Go to",
    },
    es: {
      openInMaps: "Abrir en Maps",
      contactTitle: "Contacto",
      openAction: "Abrir",
      sensoryLabel: "Barberia Sensorial",
      scrollLabel: "Desliza para descubrir",
      goToSection: "Ir a",
    },
    ca: {
      openInMaps: "Obrir a Maps",
      contactTitle: "Contacte",
      openAction: "Obrir",
      sensoryLabel: "Barberia Sensorial",
      scrollLabel: "Desplaca per descobrir",
      goToSection: "Ves a",
    },
  };

  const languageOptions: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "es", label: "Castellano" },
    { code: "ca", label: "Catalan" },
  ];

  return (
    <>
      <ScrollGlobe
        sections={localizedSections[language]}
        uiText={uiByLanguage[language]}
        className="bg-gradient-to-br from-background via-muted/20 to-background"
      />

      <div ref={menuRef} className="fixed bottom-4 left-4 z-[60]">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-background/90 px-4 text-sm font-medium text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-background"
            aria-label="Translate website"
            aria-expanded={menuOpen}
          >
            <span aria-hidden="true">A</span>
            <span>{languageOptions.find((option) => option.code === language)?.label}</span>
          </button>

          {menuOpen && (
            <div className="absolute bottom-14 left-0 min-w-[170px] overflow-hidden rounded-xl border border-border/60 bg-background/95 shadow-xl backdrop-blur-md">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => {
                    setLanguage(option.code);
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                    option.code === language
                      ? "bg-primary/15 text-primary"
                      : "text-foreground hover:bg-accent/45"
                  )}
                >
                  <span>{option.label}</span>
                  {option.code === language && <span className="text-xs">Active</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
