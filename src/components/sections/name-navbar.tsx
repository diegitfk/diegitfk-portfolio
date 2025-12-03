"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function NameNavbarAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dRef = useRef<HTMLSpanElement>(null);
  const cRef = useRef<HTMLSpanElement>(null);
  const iegoRef = useRef<HTMLSpanElement>(null);
  const ancinoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !dRef.current || !cRef.current || !iegoRef.current || !ancinoRef.current) return;

    const tl = gsap.timeline({ delay: 0.5 });

    // Estado inicial
    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set([dRef.current, cRef.current], { opacity: 0, scale: 1.2 });
    gsap.set([iegoRef.current, ancinoRef.current], { opacity: 0, x: -10 });

    // Posicionar D y C juntas en el centro inicialmente (con espacio para que no se superpongan)
    gsap.set(dRef.current, { x: 35 });
    gsap.set(cRef.current, { x: -55 });

    // Paso 1: Aparecer D y C juntas con efecto dramático
    tl.to([dRef.current, cRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.1,
    });

    // Paso 2: Pausa para que se vean juntas
    tl.to({}, { duration: 0.6 });

    // Paso 3: Separar D hacia su posición original
    tl.to(dRef.current, {
      x: 0,
      duration: 0.7,
      ease: "power3.out",
    });

    // Paso 4: Separar C hacia su posición
    tl.to(
      cRef.current,
      {
        x: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.5"
    );

    // Paso 5: Revelar "iego"
    tl.to(
      iegoRef.current,
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.4"
    );

    // Paso 6: Revelar "ancino"
    tl.to(
      ancinoRef.current,
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // Paso 7: Sutil pulse final
    tl.to(containerRef.current, {
      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
      duration: 0.3,
      ease: "power2.out",
    }).to(containerRef.current, {
      filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
      duration: 0.5,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-black dark:text-white opacity-0 font-bold text-2xl tracking-tight whitespace-nowrap"
      style={{ transformOrigin: "center center" }}
    >
      <span className="inline-flex items-center">
        {/* Diego */}
        <span className="inline-flex">
          <span ref={dRef} className="inline-block">D</span>
          <span ref={iegoRef} className="inline-block">iego</span>
        </span>
        
        {/* Espacio */}
        <span className="inline-block w-1" />
        
        {/* Cancino */}
        <span className="inline-flex">
          <span ref={cRef} className="inline-block">C</span>
          <span ref={ancinoRef} className="inline-block">ancino</span>
        </span>
      </span>
    </div>
  );
}