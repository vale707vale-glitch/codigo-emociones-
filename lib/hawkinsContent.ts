import type { InterventionKind } from "./interventions";

export interface ClimbTask {
  text: string;
  kind: InterventionKind;
}

export type NervousSystem =
  | "Congelamiento"
  | "Movilización"
  | "Ventral"
  | "Coherencia";

export interface LevelContent {
  worldview: string;
  detail: string;
  nervousSystem: NervousSystem;
  bodySignal: string;
  climbs: ClimbTask[];
}

export const hawkinsContent: Record<number, LevelContent> = {
  20: {
    worldview: "La vida es humillación.",
    detail:
      "El estado más bajo del mapa, tan bajo que Hawkins lo describe como cercano a la muerte psicológica. Sensación de no valer nada y de querer desaparecer. En el cuerpo se vive como encogimiento: hombros caídos, mirada al piso, ganas de ser invisible.",
    nervousSystem: "Congelamiento",
    bodySignal:
      "Calor en las mejillas y frío en brazos y piernas: el pecho se hunde, la mirada baja y el cuerpo entero quiere desaparecer.",
    climbs: [
      {
        text: "Escribí en dos líneas qué te dio vergüenza. Es solo para vos.",
        kind: "journaling",
      },
      {
        text: "Poné una mano en el pecho y respirá. Ofrecete la compasión que le ofrecerías a un amigo.",
        kind: "breathing",
      },
      {
        text: "Contale a una persona de confianza algo de lo que callás. La vergüenza no sobrevive a la aceptación.",
        kind: "action",
      },
    ],
  },
  30: {
    worldview: "La vida es culpa.",
    detail:
      "Autorreproche constante, hacia adentro y hacia afuera: buscar culpables en otros y condenarse por lo propio. La energía se gasta en castigarse.",
    nervousSystem: "Congelamiento",
    bodySignal:
      "Nudo en el estómago, opresión en la garganta y hombros cargados como si sostuvieran peso; la respiración queda corta y superficial.",
    climbs: [
      {
        text: "Escribí qué pasó en hechos concretos, separado de lo que te decís sobre eso.",
        kind: "journaling",
      },
      {
        text: "Respirá y repetí: al inhalar 'hice algo mal', al exhalar 'no soy malo'.",
        kind: "breathing",
      },
      {
        text: "Si lastimaste a alguien, dale un pedido de perdón concreto. Reparar vale más que castigarte.",
        kind: "action",
      },
    ],
  },
  50: {
    worldview: "La vida es desesperanza.",
    detail:
      "Desesperanza aprendida: en algún momento rendirse pareció proteger, y quedó como costumbre. Todo cuesta el doble y nada parece tener sentido. La energía está tan baja que hasta la esperanza cansa.",
    nervousSystem: "Congelamiento",
    bodySignal:
      "Cuerpo pesado y flácido, piernas sin fuerza, vacío en el centro del pecho y mirada vidriada: cuesta hasta el movimiento más chico.",
    climbs: [
      {
        text: "Hacé la cosa más pequeña y amable que puedas por vos en los próximos 5 minutos.",
        kind: "action",
      },
      {
        text: "Elegí una acción mínima diaria (2 minutos) y cumplila hoy, aunque no tengas ganas.",
        kind: "action",
      },
      {
        text: "Cinco respiraciones profundas para recordarle al cuerpo que está a salvo.",
        kind: "breathing",
      },
    ],
  },
  75: {
    worldview: "La vida es tragedia.",
    detail:
      "Tristeza profunda, pesar, duelo por pérdidas reales o simbólicas. El mundo se ve gris y uno se identifica con lo perdido. En el cuerpo: pecho pesado, garganta cerrada, lágrimas contenidas.",
    nervousSystem: "Congelamiento",
    bodySignal:
      "Presión en el pecho y en la cabeza, mandíbula tensa, llanto contenido en la garganta: energía estancada que no encuentra salida.",
    climbs: [
      {
        text: "Escribile una carta a lo que perdiste. Si llorás mientras escribís, estás avanzando.",
        kind: "journaling",
      },
      {
        text: "Mandale un mensaje a alguien que te haga bien: el duelo se alivia en compañía.",
        kind: "action",
      },
      {
        text: "Tres suspiros largos permitiendo que el pecho pesado esté ahí, sin empujarlo.",
        kind: "breathing",
      },
    ],
  },
  100: {
    worldview: "La vida es amenazante.",
    detail:
      "Estado de alerta permanente: ansiedad, evitación, pensamientos catastróficos. El miedo vive casi siempre en un futuro imaginario. En el cuerpo aparece como nudo en el estómago, mandíbula tensa y respiración corta.",
    nervousSystem: "Movilización",
    bodySignal:
      "El peso del cuerpo se adelanta, mariposas en el estómago, nuca tensa y manos y pies fríos: todo el sistema en alerta.",
    climbs: [
      {
        text: "Grounding 5-4-3-2-1: nombrá 5 cosas que ves, 4 que tocás, 3 que oís, 2 que olés, 1 que saboreás.",
        kind: "action",
      },
      {
        text: "Escribí el peor escenario posible. Después releélo: ¿es probable o solo ruidoso?",
        kind: "journaling",
      },
      {
        text: "Dale el paso más chico que podés dar igual: llamadas de 5 minutos, no renuncias.",
        kind: "action",
      },
    ],
  },
  125: {
    worldview: "La vida es un lugar de insatisfacción.",
    detail:
      "Antojos, adicciones, consumo. El condicionamiento nos hace creer que la felicidad está en el próximo logro u objeto, y lo que se consigue nunca alcanza. En el cuerpo: inquietud, urgencia por conseguir, vacío apenas se logra.",
    nervousSystem: "Movilización",
    bodySignal:
      "Tensión en la boca del estómago, mirada estrecha y fija, manos que quieren agarrar: una insatisfacción que empuja hacia afuera.",
    climbs: [
      {
        text: "Gratitud radical: nombrá 3 cosas que ya tenés y elegiste vos. El deseo se calma cuando reconocés que ya estás completo.",
        kind: "action",
      },
      {
        text: "Ante el antojo, pausa de 10 minutos. Si después sigue ahí, decidís libremente.",
        kind: "action",
      },
      {
        text: "¿Qué creés que vas a sentir cuando consigas eso? Escribilo: muchas veces buscás una sensación, no el objeto.",
        kind: "journaling",
      },
    ],
  },
  150: {
    worldview: "La vida es antagonismo.",
    detail:
      "Frustración, resentimiento, agresividad. A diferencia de los niveles anteriores, aquí hay mucha energía disponible, pero apuntada contra el mundo. En el cuerpo: calor subiendo, mandíbula apretada, puños, pecho inflado.",
    nervousSystem: "Movilización",
    bodySignal:
      "Calor en pecho, cuello y cabeza, puños cerrados, mandíbula apretada y respiración rápida y corta: energía lista para explotar.",
    climbs: [
      {
        text: "Escribí una carta con todo lo que pensás, sin filtro. Nunca la vas a enviar.",
        kind: "journaling",
      },
      {
        text: "Descargá el cuerpo: sacudilo, caminá rápido, gritá en un lugar seguro.",
        kind: "action",
      },
      {
        text: "Preguntate qué límite tuyo fue cruzado: la ira suele señalar un límite violado.",
        kind: "journaling",
      },
    ],
  },
  175: {
    worldview: "La vida es competencia.",
    detail:
      "Orgullo defensivo, arrogancia, comparación constante. Se siente bien, pero es frágil porque depende del reconocimiento externo: es fuerza, no poder. Se defiende en lugar de sostenerse solo.",
    nervousSystem: "Movilización",
    bodySignal:
      "Armadura erguida: pecho inflado pero tenso, cuello rígido y caderas bloqueadas para que la figura no se caiga.",
    climbs: [
      {
        text: "Pedí ayuda con algo chico hoy, aunque puedas solo.",
        kind: "action",
      },
      {
        text: "Listá 3 logros tuyos que también fueron fruto de circunstancias, suerte o apoyo de otros.",
        kind: "journaling",
      },
      {
        text: "Hacé algo bien y no lo cuentes a nadie.",
        kind: "action",
      },
    ],
  },
  200: {
    worldview: "La vida es un desafío manejable.",
    detail:
      "El punto de inflexión del mapa: por primera vez la energía se integra y apunta a la construcción. El coraje no es ausencia de miedo, es actuar igual con él. Aparecen la honestidad y la responsabilidad emergente.",
    nervousSystem: "Ventral",
    bodySignal:
      "La mandíbula se suelta, los pies se plantan firmes en el suelo y la respiración baja al abdomen: raíz y disposición para actuar.",
    climbs: [
      {
        text: "Decí una verdad que venís evitando, aunque sea por escrito para vos.",
        kind: "journaling",
      },
      {
        text: "Tomá esa decisión pendiente y chica que venís postergando.",
        kind: "action",
      },
      {
        text: "Antes de actuar, tres respiraciones firmes: el coraje es actuar con miedo, no sin él.",
        kind: "breathing",
      },
    ],
  },
  250: {
    worldview: "La vida es manejable.",
    detail:
      "Flexibilidad real. El 'no importa' de este nivel es una liberación, no indiferencia fría: se suelta la necesidad de tener razón y de controlar el resultado. La vida fluye cuando dejás de remar contra la corriente.",
    nervousSystem: "Ventral",
    bodySignal:
      "Músculos relajados y hombros sueltos, respiración rítmica y cara expresiva: una ligereza elástica, nada apura.",
    climbs: [
      {
        text: "En tu próxima conversación, soltá la necesidad de tener razón. Observá qué pasa.",
        kind: "action",
      },
      {
        text: "¿Qué resultado estás intentando controlar? Escribilo y soltalo.",
        kind: "journaling",
      },
      {
        text: "Al exhalar, soltá también lo que venés sosteniendo.",
        kind: "breathing",
      },
    ],
  },
  310: {
    worldview: "La vida es benévola.",
    detail:
      "Optimismo con base real, seguridad interior, constancia. Aquí la voluntad deja de ser esfuerzo y se vuelve actitud: lo que se propone, se cumple. Aparece la sensación de que las cosas están de tu lado.",
    nervousSystem: "Ventral",
    bodySignal:
      "Vitalidad estable: cuerpo dispuesto, respiración amplia y sonrisa fácil; energía disponible para lo que importa.",
    climbs: [
      {
        text: "Comprometete con una meta mediana y contale a alguien que la vas a cumplir.",
        kind: "action",
      },
      {
        text: "Cumplí la palabra más chica que tengas pendiente con alguien.",
        kind: "action",
      },
      {
        text: "¿Qué te gustaría proponer y cumplir este mes? Escribilo.",
        kind: "journaling",
      },
    ],
  },
  350: {
    worldview: "Yo soy la fuente de lo que veo en mi mundo.",
    detail:
      "Aceptación radical: perdonar, soltar juicios y hacerse responsable de la propia experiencia sin culparse ni culpar a nadie. No es resignarse: es recuperar el poder que se gastaba en reprochar.",
    nervousSystem: "Ventral",
    bodySignal:
      "El pecho se abre, la respiración profundiza sin esfuerzo, el vientre se suelta y la mirada se vuelve amable.",
    climbs: [
      {
        text: "Ante el conflicto actual preguntate: ¿qué parte de esto es mía?",
        kind: "journaling",
      },
      {
        text: "Perdoná en concreto: un mensaje, un gesto, o dejar de cobrarlo mentalmente.",
        kind: "action",
      },
      {
        text: "Inhalá aceptando lo que es; exhalá soltando cómo debería ser.",
        kind: "breathing",
      },
    ],
  },
  400: {
    worldview: "La vida es comprensible.",
    detail:
      "El reino del intelecto: análisis, ciencia, conocimiento. La mente lineal es una herramienta maravillosa, pero tiene límites, y su riesgo es la arrogancia de confundir entender con vivir.",
    nervousSystem: "Ventral",
    bodySignal:
      "Cabeza equilibrada sobre la columna, mandíbula relajada y manos abiertas: claridad centrada, aunque el cuerpo puede quedar afuera.",
    climbs: [
      {
        text: "Enseñale a alguien algo que sabés bien: el intelecto funciona mejor sirviendo.",
        kind: "action",
      },
      {
        text: "¿Qué cosa importante sabés pero todavía no vivís? Escribilo.",
        kind: "journaling",
      },
      {
        text: "Bajá de la cabeza al cuerpo: respirá sintiendo los pies en el suelo.",
        kind: "breathing",
      },
    ],
  },
  500: {
    worldview: "La vida es amorosa.",
    detail:
      "Amor incondicional, compasión, empatía. No es el amor romántico ni emocional, que puede caer a niveles bajos: es un estado del ser permanente, no transaccional. Fuente de la verdadera creatividad, la sanación y la bondad sin motivo.",
    nervousSystem: "Coherencia",
    bodySignal:
      "Calor difuso que llena todo el pecho, hormigueo suave en las manos y respiración lenta y profunda: expansión que irradia hacia afuera.",
    climbs: [
      {
        text: "Hacé un acto de bondad sin expectativa de retorno, empezando por vos.",
        kind: "action",
      },
      {
        text: "Bondad amorosa: 2 minutos deseándote bienestar a vos, 2 a alguien cercano, 2 a todos.",
        kind: "breathing",
      },
      {
        text: "Escuchá a alguien 5 minutos sin juzgar ni aconsejar.",
        kind: "action",
      },
    ],
  },
  540: {
    worldview: "La vida es plena.",
    detail:
      "Alegría serena, paciencia, presencia. No es una emoción pasajera sino una felicidad incondicional que ya no depende de circunstancias: surge sola desde adentro y se contagia a quien te rodea.",
    nervousSystem: "Coherencia",
    bodySignal:
      "Calor en todo el cuerpo sin bordes claros, respiración casi imperceptible y rostro completamente relajado: ligereza de flotar.",
    climbs: [
      {
        text: "Compartí con alguien algo que te dé alegría: crece compartiéndose.",
        kind: "action",
      },
      {
        text: "Nombrá 3 cosas buenas de hoy tal como son, sin 'pero'.",
        kind: "journaling",
      },
      {
        text: "Un minuto de presencia pura: solo respirar y notar que estás bien.",
        kind: "breathing",
      },
    ],
  },
  600: {
    worldview: "La vida es perfecta.",
    detail:
      "Paz, beatitud, experiencia de unidad. No-dualidad pura: las contradicciones se disuelven porque todo está conectado y no hay nada que arreglar ni nadie que lo necesite.",
    nervousSystem: "Coherencia",
    bodySignal:
      "Quietud total: el cuerpo casi desaparece, la respiración se vuelve mínima y no queda nada que empuje.",
    climbs: [
      {
        text: "Silencio contemplativo: 5 minutos sentado, sin objetivo, dejando que todo esté.",
        kind: "breathing",
      },
      {
        text: "¿Qué problema del día podés soltar hoy? Rendilo por escrito.",
        kind: "journaling",
      },
      {
        text: "Pasá tiempo en naturaleza o mirando lejos, sin etiquetar nada.",
        kind: "action",
      },
    ],
  },
};

export function getContent(level: number): LevelContent | undefined {
  return hawkinsContent[level];
}
