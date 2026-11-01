import Image from "next/image";
import { collection } from "@/lib/content";
import { SplitLines } from "@/components/ui/SplitLines";
import "./Collection.css";

export function Collection() {
  return (
    <section className="collection flow">
      <div className="collection__inner box">
        <SplitLines as="h2" className="collection__title display">
          The Scafe collection
        </SplitLines>
        <header className="collection__header">
          <h3 className="serif">Dive in and drink your way down the list</h3>
          <p>A collection of drinks made with care, patience and a dedication to doing things the slow way.</p>
        </header>
        <ul className="collection__list">
          {collection.map((drink) => (
            <li key={drink.title} className="collection__item">
              <figure>
                <Image src={drink.image} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" className="cover" />
              </figure>
              <div className="collection__meta display">
                <span>{drink.title}</span>
                <span>{drink.price}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
