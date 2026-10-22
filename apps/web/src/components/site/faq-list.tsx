import { Plus } from "lucide-react";
import type { Faq } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";

/** Native <details> accordion: works without JS and stays crawlable. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {faqs.map((f, i) => (
        <Reveal key={f.id} delay={i * 0.04}>
          <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
              <h3 className="font-display text-xl sm:text-2xl">{f.question}</h3>
              <span className="glass inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-open:rotate-45">
                <Plus className="size-4" />
              </span>
            </summary>
            <p className="max-w-2xl pt-4 leading-relaxed text-sand">{f.answer}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
