"use client";

import Image from "next/image";
import { useRef } from "react";
import { signatures } from "@/lib/content";
import { useGSAP } from "@/lib/gsap";
import { revealScene, SHAPES } from "@/lib/scene";
import { forms, useContactForm } from "@/components/shell/ContactForms";
import { Arrow } from "@/components/ui/Icons";
import { TimezoneBar } from "@/components/ui/TimezoneBar";
import "./Signatures.css";

function Signature({ item }: { item: (typeof signatures)[number] }) {
  const root = useRef<HTMLElement>(null);
  const openForm = useContactForm();

  useGSAP(
    () => {
      if (root.current) {
        revealScene(root.current, SHAPES.ridge).fromTo(
          ".signature__bg img",
          { scale: 1.2 },
          { scale: 1, duration: 1 },
          0
        );
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="signature scene scene--overlap">
      <div className="stage signature__stage box">
        <figure className="signature__bg">
          <Image src={item.image} alt="" fill sizes="100vw" className="cover" />
        </figure>
        <div className="signature__content">
          <div>
            <h2 className="signature__title display">{item.title}</h2>
            <p className="signature__tag display">{item.tag}</p>
          </div>
          <div className="signature__side">
            <p>{item.text}</p>
            <button type="button" className="signature__play" onClick={() => openForm(forms.book)}>
              <span className="signature__circle">
                <Arrow />
              </span>
              <span className="display">Save me a seat</span>
            </button>
          </div>
        </div>
        <TimezoneBar />
      </div>
    </section>
  );
}

export function Signatures() {
  return signatures.map((item) => <Signature key={item.title} item={item} />);
}
