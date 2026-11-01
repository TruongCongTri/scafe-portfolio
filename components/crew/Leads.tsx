import Image from "next/image";
import { leads } from "@/lib/content";
import { SplitLines } from "@/components/ui/SplitLines";
import { VectorGrid } from "@/components/ui/VectorGrid";
import "./Leads.css";

export function Leads() {
  return (
    <section className="leads">
      {leads.map((lead) => {
        const [first, ...rest] = lead.name.split(" ");
        return (
          <article key={lead.name} className="leads__row">
            <div className="leads__left">
              <SplitLines as="h2" className="leads__name display">
                {first}
                <br />
                {rest.join(" ")}
              </SplitLines>
              <div className="leads__grid">
                <VectorGrid color="rgba(225, 212, 195, 0.14)" />
              </div>
            </div>
            <div className="leads__right">
              <h3 className="serif">{lead.role}</h3>
              <figure>
                <Image src={lead.image} alt={lead.pick} fill sizes="(max-width: 1024px) 60vw, 25vw" className="cover" />
                <figcaption>Drinks: {lead.pick}</figcaption>
              </figure>
            </div>
          </article>
        );
      })}
    </section>
  );
}
