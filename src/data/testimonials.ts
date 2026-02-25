export type TestimonialItem = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const TESTIMONIALS_BY_LANGUAGE: Record<"en" | "es" | "ca", TestimonialItem[]> = {
  en: [
    {
      quote:
        "The attention to detail is incredible. You can feel the quality in every step, and the team makes you feel at home from the first minute.",
      name: "Tamar Mendelson",
      designation: "Client",
      src: "/testimonials/tamar-mendelson.jpg",
    },
    {
      quote:
        "Excellent vibe, top-level service, and results that always fit my style. I keep coming back because the experience is consistently great.",
      name: "Joe Charlescraft",
      designation: "Frequent Visitor",
      src: "/testimonials/joe-charlescraft.jpg",
    },
    {
      quote:
        "A calm space, friendly professionals, and a finish that always looks sharp. Highly recommended if you want more than a quick haircut.",
      name: "Martina Edelweist",
      designation: "Satisfied Client",
      src: "/testimonials/martina-edelweist.jpg",
    },
  ],
  es: [
    {
      quote:
        "La atencion al detalle es increible. Se nota la calidad en cada paso y el equipo te hace sentir como en casa desde el primer minuto.",
      name: "Tamar Mendelson",
      designation: "Cliente",
      src: "/testimonials/tamar-mendelson.jpg",
    },
    {
      quote:
        "Muy buen ambiente, servicio de primer nivel y resultados que siempre encajan con mi estilo. Vuelvo siempre porque la experiencia es constante.",
      name: "Joe Charlescraft",
      designation: "Cliente habitual",
      src: "/testimonials/joe-charlescraft.jpg",
    },
    {
      quote:
        "Un espacio tranquilo, profesionales cercanos y un acabado impecable. Muy recomendable si buscas algo mas que un corte rapido.",
      name: "Martina Edelweist",
      designation: "Clienta satisfecha",
      src: "/testimonials/martina-edelweist.jpg",
    },
  ],
  ca: [
    {
      quote:
        "L'atencio al detall es increible. Es nota la qualitat a cada pas i l'equip et fa sentir com a casa des del primer minut.",
      name: "Tamar Mendelson",
      designation: "Clienta",
      src: "/testimonials/tamar-mendelson.jpg",
    },
    {
      quote:
        "Molt bon ambient, servei de primer nivell i resultats que sempre encaixen amb el meu estil. Hi torno sempre per l'experiencia.",
      name: "Joe Charlescraft",
      designation: "Client habitual",
      src: "/testimonials/joe-charlescraft.jpg",
    },
    {
      quote:
        "Un espai tranquil, professionals propers i un acabat impecable. Molt recomanable si busques mes que un tall rapid.",
      name: "Martina Edelweist",
      designation: "Clienta satisfeta",
      src: "/testimonials/martina-edelweist.jpg",
    },
  ],
};
