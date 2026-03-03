import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import qrCode from "../../../images/qr-code.png";
import "./businesscards.css";

export const metadata: Metadata = {
  title: "Business Cards | Example Page",
  description: "Business card mockups for Example Page.",
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
  hideLabel?: boolean;
};

function ContactTile({ label, value, icon, hideLabel = false }: ContactTileProps) {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <div className="flex min-w-0 items-center gap-2.5 text-left">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/6">{icon}</div>
        <div className="min-w-0 text-left">
          {!hideLabel ? <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,0.78)]">{label}</p> : null}
          <p className="text-[12px] font-semibold leading-tight text-slate-50 [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,0.8)] sm:text-[13px]">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function BusinessCardsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="businesscards-page-bg absolute inset-0 bg-[radial-gradient(120%_90%_at_8%_10%,rgba(39,88,79,0.34),rgba(7,12,12,0.92)_55%,rgba(5,6,7,0.98)_100%)]" />
      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 text-center sm:mb-5">
          <h1 className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Business Card Concepts
          </h1>
          <p className="mt-1 text-sm text-emerald-100/80">examplepage.com</p>
        </div>

        <div className="businesscards-grid grid items-center justify-center gap-4 lg:grid-cols-2">
          <article
            className="businesscard relative mx-auto w-full overflow-hidden rounded-[24px] border border-transparent"
          >
            <div className="businesscard-artwork absolute inset-0 bg-[linear-gradient(118deg,rgba(15,26,22,0.9)_0%,rgba(16,44,36,0.72)_33%,rgba(8,14,13,0.94)_70%,rgba(5,8,8,0.98)_100%)]" />
            <div className="businesscard-safe-area relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-transparent bg-transparent px-3.5 pb-2.5 pt-3.5 sm:px-4 sm:pb-3 sm:pt-4">
              <div className="pt-2 text-left">
                <p className="text-[19px] font-extrabold uppercase tracking-[0.14em] text-slate-50 [text-shadow:0_1px_0_rgba(0,0,0,0.92),0_2px_4px_rgba(0,0,0,0.82)] sm:text-[22px]">EXAMPLE PAGE</p>
                <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-50 [text-shadow:0_1px_0_rgba(0,0,0,0.92),0_2px_4px_rgba(0,0,0,0.82)]">BARBERSHOP DE AUTOR</p>
              </div>
            </div>
          </article>

          <article
            className="businesscard relative mx-auto w-full overflow-hidden rounded-[24px] border border-transparent"
          >
            <div className="businesscard-artwork absolute inset-0 bg-[linear-gradient(120deg,rgba(12,19,22,0.9)_0%,rgba(18,28,33,0.82)_45%,rgba(7,10,12,0.98)_100%)]" />
            <div className="businesscard-safe-area relative flex h-full flex-col rounded-2xl border border-transparent bg-transparent p-2.5 font-[family-name:var(--font-inter)] sm:p-3">
              <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="justify-self-start self-start rounded-lg border border-white/22 bg-[linear-gradient(145deg,rgba(18,28,34,0.34)_0%,rgba(18,28,34,0.22)_52%,rgba(18,28,34,0.3)_100%)] p-1 backdrop-blur-[1px] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.26)] sm:p-1.5">
                  <div className="space-y-0.5">
                    <ContactTile label="UBICACION" value="Sagrada Familia, Barcelona" icon={<LocationIcon />} hideLabel />
                    <div className="mx-1 h-px bg-white/25" />
                    <ContactTile label="WhatsApp" value="1234 567 890" icon={<WhatsAppIcon />} hideLabel />
                    <div className="mx-1 h-px bg-white/25" />
                    <ContactTile label="TELEFONO" value="1234 098 765" icon={<PhoneIcon />} hideLabel />
                    <div className="mx-1 h-px bg-white/25" />
                    <ContactTile label="Instagram" value="@EXAMPLEPAGE" icon={<InstagramIcon />} hideLabel />
                    <div className="mx-1 h-px bg-white/25" />
                    <ContactTile label="PAGINA" value="examplepage.com" icon={<WebsiteIcon />} hideLabel />
                  </div>
                </div>

                <div className="justify-self-end self-start rounded-lg border border-white/22 bg-[linear-gradient(145deg,rgba(18,28,34,0.34)_0%,rgba(18,28,34,0.22)_52%,rgba(18,28,34,0.3)_100%)] p-1 backdrop-blur-[1px] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.26)] sm:p-1.5">
                  <div className="flex h-full flex-col items-center justify-start gap-2.5 px-1 pb-1 pt-1.5 text-center sm:gap-3 sm:pt-2">
                    <div>
                      <p className="text-[12px] font-semibold leading-tight text-slate-50 [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,0.8)] sm:text-[13px]">Reservas / Book Now!</p>
                    </div>
                    <div className="relative shrink-0 p-0">
                      <div className="pointer-events-none absolute inset-[-3px] -z-10 rounded-xl bg-emerald-300/22 blur-sm" />
                      <Image src={qrCode} alt="Booking QR code" className="h-[5.25rem] w-[5.25rem] object-contain sm:h-[6rem] sm:w-[6rem]" />
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
