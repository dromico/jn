import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";

/** A grid of tiles with one missing, showing the screed underneath. */
function MissingTile({ label }: { label: string }) {
  const cols = 6;
  const rows = 4;
  const missing = [3, 1];
  return (
    <svg viewBox="0 0 360 240" role="img" aria-label={label} className="h-auto w-full max-w-[480px]">
      <rect width="360" height="240" fill="#B9BEBA" />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          if (c === missing[0] && r === missing[1]) {
            return (
              <g key={`${c}-${r}`}>
                <rect x={c * 60 + 2} y={r * 60 + 2} width="56" height="56" fill="#D4D1CA" />
                <path d={`M${c * 60 + 8} ${r * 60 + 14} q8 -4 16 0 t16 0 t16 0 M${c * 60 + 8} ${r * 60 + 30} q8 -4 16 0 t16 0 t16 0 M${c * 60 + 8} ${r * 60 + 46} q8 -4 16 0 t16 0 t16 0`} stroke="#BDB7AC" strokeWidth="2" fill="none" />
              </g>
            );
          }
          const shade = ["#C9DAD3", "#C2D6CE", "#CCDDD6"][(c * 7 + r * 3) % 3];
          return <rect key={`${c}-${r}`} x={c * 60 + 1} y={r * 60 + 1} width="58" height="58" fill={shade} />;
        }),
      )}
      <rect x="236" y="182" width="56" height="56" fill="#C9DAD3" transform="rotate(-8 264 210) translate(30 -20)" stroke="#8FA19C" />
    </svg>
  );
}

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="wrap grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
      <div>
        <h1 className="display text-[38px] sm:text-[56px]">{t("title")}</h1>
        <p className="measure mt-5 text-[18px] text-ink-soft">{t("body")}</p>
        <Link href="/" className={`${buttonClass("primary", "lg")} mt-8`}>
          {t("home")}
        </Link>
      </div>
      <MissingTile label={t("art")} />
    </section>
  );
}
