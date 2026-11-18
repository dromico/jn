import { whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/Button";
import { SwatchCanvas } from "@/components/ui/SwatchCanvas";

/** The vinyl-green band that closes most pages. */
export function CtaBand({ title, body, button, message }: { title: string; body: string; button: string; message?: string }) {
  return (
    <section className="wrap py-20 sm:py-24">
      <div className="on-vinyl relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-md bg-vinyl px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[380px] opacity-40 md:block [mask-image:linear-gradient(90deg,transparent,#000_45%)]">
          <SwatchCanvas kind="homogeneous-vinyl" />
        </div>
        <div className="relative">
          <h2 className="display mb-3.5 text-[34px] text-white sm:text-[48px]">{title}</h2>
          <p className="max-w-[34em] text-[18px] text-[#D7E8E2]">{body}</p>
        </div>
        <ButtonLink href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="light" size="lg" icon={<WhatsAppIcon width={20} height={20} />} className="relative text-[17px] font-bold">
          {button}
        </ButtonLink>
      </div>
    </section>
  );
}
