import type { InterventionId } from "@/types";
import { getContent } from "@/lib/hawkinsContent";

export type InterventionKind =
  | "breathing"
  | "journaling"
  | "action"
  | "lettinggo"
  | "scan"
  | "posture"
  | "discharge"
  | "focuswheel";

export interface Intervention {
  id: InterventionId | (string & {});
  kind: InterventionKind;
  title: string;
  description: string;
}

const KIND_TITLE: Record<InterventionKind, string> = {
  breathing: "Ejercicio de respiración",
  journaling: "Escritura liberadora",
  action: "Acción concreta",
  lettinggo: "Soltar (rendición)",
  scan: "Escáner corporal",
  posture: "Postura de coraje",
  discharge: "Descarga somática",
  focuswheel: "Rueda de Enfoque",
};

const LETTING_GO_CARD: Intervention = {
  id: "LettingGo",
  kind: "lettinggo",
  title: "Soltar (rendición)",
  description:
    "Guía paso a paso del método central de Hawkins: permitir la emoción y dejar que su energía pase.",
};

const FOCUS_WHEEL_CARD: Intervention = {
  id: "FocusWheel",
  kind: "focuswheel",
  title: "Rueda de Enfoque",
  description:
    "Aflojá el pensamiento que pesa: doce frases cada vez más creibles hasta el alivio.",
};

const COURAGE_BRIDGE_CARD: Intervention = {
  id: "CourageBridge",
  kind: "posture",
  title: "Puente al Coraje",
  description:
    "Cruzá al nivel 200 a través del cuerpo: postura, pies firmes y respiración abdominal.",
};

const ANGER_DISCHARGE_CARD: Intervention = {
  id: "AngerDischarge",
  kind: "discharge",
  title: "Descargar la ira",
  description:
    "Movés la energía acumulada en puños, mandíbula y pecho para que se vaya por el cuerpo.",
};

function climbsToInterventions(level: number): Intervention[] {
  const content = getContent(level);
  if (!content) return [];
  return content.climbs.map((task, index) => ({
    id: `Climb-${level}-${index}`,
    kind: task.kind,
    title: KIND_TITLE[task.kind],
    description: task.text,
  }));
}

function buildPack(): Intervention[] {
  return [
    {
      id: "ControlList",
      kind: "action",
      title: "Lista de control",
      description:
        "Escribí 3 cosas que sí podés controlar hoy. Soltá el resto.",
    },
    {
      id: "Gratitude",
      kind: "action",
      title: "Ejercicio de gratitud",
      description: "Nombrá 3 cosas por las que estás agradecido ahora mismo.",
    },
    {
      id: "MicroGoal",
      kind: "action",
      title: "Micro-meta del día",
      description:
        "Planificá una meta pequeña para hoy. Que sea tan chica que sea imposible fallar.",
    },
  ];
}

function expandPack(): Intervention[] {
  return [
    {
      id: "KindMessage",
      kind: "action",
      title: "Mensaje de agradecimiento",
      description:
        "Enviá a alguien un mensaje agradeciéndole algo específico de su presencia en tu vida.",
    },
    {
      id: "LovingKindness",
      kind: "breathing",
      title: "Bondad amorosa",
      description:
        "5 minutos deseando bienestar, primero a vos, luego a alguien cercano y después a todos.",
    },
    {
      id: "Nature",
      kind: "action",
      title: "Observación sin juzgar",
      description:
        "Salí a la naturaleza o mirá por la ventana. Observá 5 minutos sin etiquetar nada.",
    },
  ];
}

export function getInterventions(
  emotionLevel: number,
  emotionName: string
): Intervention[] {
  const specific = climbsToInterventions(emotionLevel);
  if (emotionLevel >= 200) {
    if (specific.length > 0) return specific;
    if (emotionLevel < 350) return buildPack();
    return expandPack();
  }
  const somatic: Intervention[] = [];
  if (emotionLevel >= 125 && emotionLevel <= 175) {
    somatic.push(COURAGE_BRIDGE_CARD);
  }
  if (emotionLevel === 150) {
    somatic.push(ANGER_DISCHARGE_CARD);
  }
  return [LETTING_GO_CARD, ...somatic, FOCUS_WHEEL_CARD, ...specific];
}
