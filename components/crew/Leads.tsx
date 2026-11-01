import Image from "next/image";
import { getI18n } from "@/i18n/server";
import { SplitLines } from "@/components/ui/SplitLines";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./Leads.css";

export async function Leads() {
  const { content } = await getI18n();

  return (
    <section className="leads">
      {content.leads.map((lead) => {
        const words = lead.name.split(" ");
        const half = Math.ceil(words.length / 2);
        return (
          <article key={lead.image} className="leads__row">
            <div className="leads__left">
              <SplitLines as="h2" className="leads__name display">
                {words.slice(0, half).join(" ")}
                <br />
                {words.slice(half).join(" ")}
              </SplitLines>
              <div className="leads__grid">
                <VectorGrid color="rgba(225, 212, 195, 0.14)" />
              </div>
            </div>
            <div className="leads__right">
              {lead.role && <h3 className="serif">{lead.role}</h3>}
              <figure>
                <Image src={lead.image} alt={lead.name} fill sizes="(max-width: 1024px) 60vw, 25vw" className="cover" />
              </figure>
            </div>
          </article>
        );
      })}
    </section>
  );
}
