import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import backgroundImage from "../../../images/mascara.jpeg";
import guaiLogo from "../../../images/ChatGPT Image 24 feb 2026, 11_05_08 p.m..png";
import qrCode from "../../../images/qr-code.png";

export const metadata: Metadata = {
  title: "Business Cards | Guaixperience",
  description: "Business card mockups for GUAI XPERIENCE.",
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-200" aria-hidden="true">
      <path d="M12.04 2.5c-5.24 0-9.49 4.25-9.49 9.49 0 1.83.52 3.61 1.49 5.14L2.5 21.5l4.48-1.48a9.44 9.44 0 0 0 5.06 1.47h.01c5.24 0 9.49-4.25 9.49-9.49S17.29 2.5 12.04 2.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.54 7.9c-.24.01-.5.1-.67.34-.2.29-.52.83-.52 2.01s.86 2.32.98 2.48c.12.16 1.68 2.68 4.17 3.65 2.07.8 2.5.64 2.95.6.45-.04 1.45-.59 1.65-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28-.25-.12-1.45-.71-1.68-.79-.22-.08-.39-.12-.55.12-.16.25-.62.79-.76.95-.14.16-.28.18-.53.06-.25-.12-1.06-.39-2.01-1.25-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.76-1.81-.2-.47-.4-.41-.55-.41h-.47Z" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-200" aria-hidden="true">
      <path d="M6.7 3.5h3.6l1.8 4.44-2.34 1.86a14.84 14.84 0 0 0 4.45 4.45l1.86-2.34 4.44 1.8v3.6a1.7 1.7 0 0 1-1.7 1.7C10.77 19 5 13.23 5 6.2a1.7 1.7 0 0 1 1.7-1.7Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-200" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.25" cy="6.75" r="1" fill="currentColor" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-200" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.8 12h16.4M12 3.8c2.2 2.38 3.41 5.24 3.41 8.2 0 2.96-1.21 5.82-3.41 8.2-2.2-2.38-3.41-5.24-3.41-8.2 0-2.96 1.21-5.82 3.41-8.2Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-200" aria-hidden="true">
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type ContactTileProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

function ContactTile({ label, value, icon }: ContactTileProps) {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <div className="flex min-w-0 items-center gap-2.5 text-left">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/6">{icon}</div>
        <div className="min-w-0 text-left">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/65">{label}</p>
          <p className="text-[12px] font-semibold leading-tight text-white sm:text-[13px]">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function BusinessCardsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Image
        src={backgroundImage}
        alt="Mask nature background"
        fill
        priority
        className="object-cover object-center blur-[7px] brightness-[0.42] saturate-110"
      />
      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 text-center sm:mb-5">
          <h1 className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Business Card Concepts
          </h1>
          <p className="mt-1 text-sm text-emerald-100/80">guaiexperience.com</p>
        </div>

        <div className="grid items-center gap-4 lg:grid-cols-2">
          <article
            className="relative aspect-[1.9/1] overflow-hidden rounded-[24px] border border-white/25 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:p-5"
          >
            <Image
              src={backgroundImage}
              alt="Mask card artwork left"
              fill
              className="object-cover"
              style={{ objectPosition: "34% center" }}
            />
            <div className="absolute inset-0 bg-black/24" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/12 p-3.5 sm:p-4">
              <div>
                <Image src={guaiLogo} alt="GUAI XPERIENCE logo" className="h-auto w-[205px] max-w-full drop-shadow-[0_8px_22px_rgba(0,0,0,0.55)] sm:w-[230px]" />
                <p className="mt-1.5 max-w-sm text-[12px] leading-snug text-white/88">Sensory barbershop ritual in Barcelona.</p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <p className="text-[10px] uppercase tracking-[0.13em] text-white/78">SIGNATURE BARBERSHOP</p>
              </div>
            </div>
          </article>

          <article
            className="relative aspect-[1.9/1] overflow-hidden rounded-[24px] border border-white/25 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:p-5"
          >
            <Image
              src={backgroundImage}
              alt="Mask card artwork right"
              fill
              className="object-cover"
              style={{ objectPosition: "66% center" }}
            />
            <div className="relative flex h-full flex-col rounded-2xl border border-white/20 bg-black/26 p-2.5 font-[family-name:var(--font-inter)] sm:p-3">
              <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="rounded-xl border border-white/25 bg-black/34 p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.25)] backdrop-blur-[2px]">
                  <div className="space-y-0.5">
                    <ContactTile label="WhatsApp" value="654 823 296" icon={<WhatsAppIcon />} />
                    <div className="mx-1 h-px bg-white/12" />
                    <ContactTile label="Call" value="931 286 182" icon={<PhoneIcon />} />
                    <div className="mx-1 h-px bg-white/12" />
                    <ContactTile label="Instagram" value="@guaixperience" icon={<InstagramIcon />} />
                    <div className="mx-1 h-px bg-white/12" />
                    <ContactTile label="Website" value="guaiexperience.com" icon={<WebsiteIcon />} />
                    <div className="mx-1 h-px bg-white/12" />
                    <ContactTile label="Location" value="C. Llull 82 - Barcelona" icon={<LocationIcon />} />
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200/30 bg-[linear-gradient(165deg,rgba(13,26,20,0.76),rgba(9,15,14,0.62))] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-100/80">Bookings</p>
                      <p className="mt-1 text-[11px] font-medium leading-tight text-white/95">Scan to book your appointment</p>
                    </div>
                    <div className="relative shrink-0 p-1">
                      <div className="pointer-events-none absolute inset-[-8px] -z-10 rounded-2xl bg-emerald-300/35 blur-lg" />
                      <Image src={qrCode} alt="Booking QR code" className="h-[4.5rem] w-[4.5rem] object-contain sm:h-20 sm:w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
