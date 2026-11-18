"use client";

/**
 * WhatsApp-only quote builder. No backend: on submit it writes a message in
 * the current language and opens wa.me with it prefilled.
 */
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Field = "name" | "company" | "location" | "service" | "area" | "condition" | "timeline" | "notes";
type Errors = Partial<Record<Field, string>>;

const inputClass =
  "mt-2 block w-full min-h-12 rounded-md border border-hairline-strong bg-white px-3.5 py-3 text-[16px] text-spruce placeholder:text-[#7A8581] focus-visible:border-vinyl aria-[invalid=true]:border-[#B4412B]";

function FieldShell({ id, label, optional, error, hint, children }: { id: string; label: string; optional?: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-stone">({optional})</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[14px] font-medium text-[#A33A26]">
          {error}
        </p>
      )}
    </div>
  );
}

export function QuoteBuilder({ services, defaultService }: { services: { value: string; label: string }[]; defaultService?: string }) {
  const t = useTranslations("contact");
  const uid = useId();
  const id = (f: Field) => `${uid}-${f}`;
  const [errors, setErrors] = useState<Errors>({});
  const summary = useRef<HTMLDivElement>(null);

  const conditions = [
    { value: "new", label: t("conditionNew") },
    { value: "tiles", label: t("conditionTiles") },
    { value: "vinyl", label: t("conditionVinyl") },
  ];
  const timelines = [
    { value: "asap", label: t("timelineAsap") },
    { value: "month", label: t("timelineMonth") },
    { value: "3months", label: t("timeline3") },
    { value: "planning", label: t("timelinePlanning") },
  ];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const v = (f: Field) => String(data.get(f) ?? "").trim();

    const next: Errors = {};
    if (v("name").length < 2) next.name = t("errName");
    if (v("location").length < 2) next.location = t("errLocation");
    if (!v("service")) next.service = t("errService");
    const area = v("area").replace(/,/g, "");
    if (area && !/^\d+(\.\d+)?$/.test(area)) next.area = t("errArea");
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => {
        summary.current?.focus();
        const first = (Object.keys(next) as Field[])[0];
        document.getElementById(id(first))?.scrollIntoView({ block: "center" });
      });
      return;
    }

    const label = (list: { value: string; label: string }[], value: string) => list.find((o) => o.value === value)?.label ?? "";
    const lines = [
      t("msgIntro"),
      "",
      `${t("msgName")}: ${v("name")}`,
      v("company") ? `${t("msgCompany")}: ${v("company")}` : null,
      `${t("msgLocation")}: ${v("location")}`,
      `${t("msgService")}: ${v("service") === "not-sure" ? t("notSure") : label(services, v("service"))}`,
      area ? `${t("msgArea")}: ${area} m²` : null,
      v("condition") ? `${t("msgCondition")}: ${label(conditions, v("condition"))}` : null,
      v("timeline") ? `${t("msgTimeline")}: ${label(timelines, v("timeline"))}` : null,
      v("notes") ? `${t("msgNotes")}: ${v("notes")}` : null,
    ].filter((l): l is string => l !== null);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  const describedBy = (f: Field, hint = false) => (errors[f] ? `${id(f)}-error` : hint ? `${id(f)}-hint` : undefined);
  const errorCount = Object.keys(errors).length;

  return (
    <form id="quote-form" noValidate onSubmit={onSubmit} className="grid gap-6">
      <div ref={summary} tabIndex={-1} aria-live="assertive" className={cn(errorCount ? "rounded-md border border-[#B4412B] bg-white px-4 py-3 text-[15px] text-[#A33A26]" : "sr-only")}>
        {errorCount > 0 && t("errSummary")}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldShell id={id("name")} label={t("name")} error={errors.name}>
          <input id={id("name")} name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={inputClass} />
        </FieldShell>
        <FieldShell id={id("company")} label={t("company")} optional={t("optional")}>
          <input id={id("company")} name="company" autoComplete="organization" className={inputClass} />
        </FieldShell>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldShell id={id("location")} label={t("location")} hint={t("locationHint")} error={errors.location}>
          <input id={id("location")} name="location" autoComplete="address-level2" required aria-invalid={!!errors.location} aria-describedby={describedBy("location", true)} className={inputClass} />
        </FieldShell>
        <FieldShell id={id("service")} label={t("service")} error={errors.service}>
          <select id={id("service")} name="service" required defaultValue={defaultService ?? ""} aria-invalid={!!errors.service} aria-describedby={describedBy("service")} className={inputClass}>
            <option value="" disabled>
              {t("servicePick")}
            </option>
            {services.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
            <option value="not-sure">{t("notSure")}</option>
          </select>
        </FieldShell>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldShell id={id("area")} label={t("area")} optional={t("optional")} error={errors.area}>
          <div className="relative">
            <input id={id("area")} name="area" inputMode="decimal" aria-invalid={!!errors.area} aria-describedby={describedBy("area")} className={cn(inputClass, "pr-14 tabular-nums")} />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-4 top-2 flex items-center text-stone">
              {t("areaUnit")}
            </span>
          </div>
        </FieldShell>
        <FieldShell id={id("timeline")} label={t("timeline")} optional={t("optional")}>
          <select id={id("timeline")} name="timeline" defaultValue="" className={inputClass}>
            <option value="">{t("timelinePick")}</option>
            {timelines.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <fieldset>
        <legend className="text-[15px] font-semibold">
          {t("condition")} <span className="font-normal text-stone">({t("optional")})</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {conditions.map((c) => (
            <label key={c.value} className="relative cursor-pointer">
              <input type="radio" name="condition" value={c.value} className="peer sr-only" />
              <span className="flex min-h-11 items-center rounded-md border border-hairline-strong bg-white px-4 text-[15px] peer-checked:border-spruce peer-checked:bg-spruce peer-checked:text-slab peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vinyl">
                {c.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FieldShell id={id("notes")} label={t("notes")} optional={t("optional")} hint={t("notesHint")}>
        <textarea id={id("notes")} name="notes" rows={4} aria-describedby={`${id("notes")}-hint`} className={cn(inputClass, "resize-y")} />
      </FieldShell>

      <div>
        <button type="submit" className={cn(buttonClass("primary", "lg"), "w-full sm:w-auto")}>
          <WhatsAppIcon />
          {t("submit")}
        </button>
        <p className="mt-3 text-[14px] text-stone">{t("submitNote")}</p>
      </div>
    </form>
  );
}
