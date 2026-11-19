import type { Locale } from "@/i18n/routing";
import type { Tool } from "@/content/equipment";
import { Photo } from "@/components/ui/Placeholder";
import { publicFileExists } from "@/lib/files";

export function ToolsGrid({ tools, locale, columns = 4 }: { tools: Tool[]; locale: Locale; columns?: 3 | 4 }) {
  return (
    <ul className={columns === 4 ? "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-4" : "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-3"}>
      {tools.map((tool) => (
        <li key={tool.id}>
          <Photo
            src={publicFileExists(tool.image) ? tool.image : null}
            alt={tool.name[locale]}
            label={tool.placeholder[locale]}
            className="aspect-[4/5] sm:aspect-auto sm:h-[280px]"
            sizes="(min-width: 1024px) 25vw, 50vw"
            fit="contain"
          />
          <p className="mb-1 mt-3.5 text-[17px] font-semibold leading-snug">{tool.name[locale]}</p>
          <p className="text-[14px] text-stone">{tool.does[locale]}</p>
        </li>
      ))}
    </ul>
  );
}
