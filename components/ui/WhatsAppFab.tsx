"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "./icons";
import { cn } from "@/lib/cn";

/** Floating WhatsApp button. Hides while the contact form is on screen. */
export function WhatsAppFab() {
  const t = useTranslations("common");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const attach = () => {
      io?.disconnect();
      const form = document.getElementById("quote-form");
      if (!form) {
        setHidden(false);
        return;
      }
      io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.05 });
      io.observe(form);
    };
    attach();
    // Client navigations swap the page; re-check when the DOM changes.
    const mo = new MutationObserver(attach);
    const main = document.getElementById("main");
    if (main) mo.observe(main, { childList: true });
    return () => {
      io?.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("chatWhatsapp")}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "fixed bottom-5 right-4 z-50 flex size-[60px] items-center justify-center rounded-full bg-vinyl text-white shadow-[0_6px_20px_rgba(35,49,45,0.22)] transition-[opacity,transform] duration-200 hover:bg-vinyl-dark sm:bottom-8 sm:right-8",
        hidden && "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <WhatsAppIcon width={26} height={26} />
    </a>
  );
}
