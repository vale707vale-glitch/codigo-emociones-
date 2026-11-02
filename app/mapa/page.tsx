import { GlassCard } from "@/components/GlassCard";
import { hawkinsMap } from "@/lib/hawkinsMap";
import { getContent } from "@/lib/hawkinsContent";
import { ClimbTaskList } from "@/components/ClimbTaskList";

export const metadata = {
  title: "El Mapa",
};

export default function MapaPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-8 py-8">
      <h1 className="font-display text-4xl">El Mapa de Conciencia</h1>

      <GlassCard className="space-y-3 p-6 text-sm leading-relaxed text-zinc-300">
        <p>
          El Mapa de Conciencia de David R. Hawkins ordena los estados
          emocionales en una escala de 20 a 600. No es una línea recta: cada
          nivel representa una forma distinta de percibir la vida, con su propia
          energía.
        </p>
        <p>
          El nivel <strong className="text-white">200, Coraje</strong>, es la
          frontera. Debajo, la energía va hacia la supervivencia: se contrae,
          resiste y consume. Encima, la energía se abre y construye: sostiene,
          crea y expande.
        </p>
        <p>
          La regla del ascenso es simple:{" "}
          <strong className="text-white">no se salta del 20 al 500</strong>. Se
          sube de a peldaños, y cada estado tiene una función en el camino. Por
          eso esta herramienta no te pide estar bien: te muestra cuál es el
          próximo paso desde donde estás.
        </p>
        <p className="text-xs text-zinc-500">
          Herramienta de autoconocimiento inspirada en el marco de Hawkins; no
          es una medición científica ni un diagnóstico.
        </p>
      </GlassCard>

      <GlassCard className="space-y-4 p-6 text-sm leading-relaxed text-zinc-300">
        <h2 className="font-display text-2xl text-white">La ciencia detrás</h2>
        <p>
          El mapa de Hawkins no es ciencia validada: es un marco de
          autoconocimiento. Pero sus niveles coinciden, de forma llamativa, con
          lo que la neurociencia corporal observa desde otros caminos. Estas son
          las cuatro referencias que sostienen los registros corporales y los
          estados de sistema nervioso que ves en cada nivel:
        </p>
        <div className="space-y-1">
          <p className="font-medium text-white">
            Mapas corporales de las emociones · Lauri Nummenmaa (PNAS, 2014)
          </p>
          <p>
            Cientos de personas de distintas culturas señalaron en siluetas
            dónde sentían cada emoción. El resultado: patrones corporales
            consistentes y transculturales. Las emociones bajas &ldquo;enfrían&rdquo;
            brazos y piernas mientras calientan la cara y el pecho; el amor y la
            alegría encienden todo el cuerpo.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-white">
            Teoría Polivagal · Stephen Porges
          </p>
          <p>
            El sistema nervioso tiene tres estados:{" "}
            <strong className="text-white">congelamiento</strong> (colapso),
            <strong className="text-white"> movilización</strong> (lucha o
            huida) y<strong className="text-white"> ventral</strong>{" "}
            (seguridad y conexión). Los chips que acompañan cada nivel del mapa
            usan exactamente ese lenguaje.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-white">
            Marcador somático · Antonio Damasio
          </p>
          <p>
            Las emociones no son ideas abstractas: se registran como sensaciones
            físicas en vísceras y músculos, y el cerebro las usa para decidir.
            Por eso &ldquo;¿dónde lo sentís en el cuerpo?&rdquo; suele decir más
            que &ldquo;¿qué te pasa?&rdquo;.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-white">
            El cuerpo lleva la cuenta · Bessel van der Kolk
          </p>
          <p>
            En los estados más bajos, pensar positivo no alcanza: la vía rápida
            es de abajo hacia arriba. Mover el cuerpo, respirar profundo y
            cambiar la postura le avisa al cerebro que está a salvo. Es la
            lógica de todas las herramientas de esta app.
          </p>
        </div>
      </GlassCard>

      <div className="space-y-2">
        {hawkinsMap.map((level) => {
          const content = getContent(level.level);
          return (
            <details key={level.level} className="group">
              <summary
                className="flex cursor-pointer list-none items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/25"
                style={{ borderLeftColor: level.color, borderLeftWidth: 3 }}
              >
                <span className="w-12 shrink-0 font-mono text-sm text-zinc-400">
                  {level.level}
                </span>
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: level.color }}
                />
                <span className="flex-1 text-sm text-white">
                  {level.name} {level.icon}
                </span>
                <span
                  className={`text-zinc-500 transition-transform group-open:rotate-45`}
                >
                  +
                </span>
              </summary>
              {content && (
                <div className="space-y-2 px-4 pb-4 pt-3 text-left text-sm leading-relaxed text-zinc-400">
                  <p className="italic text-zinc-300">
                    &ldquo;{content.worldview}&rdquo;
                  </p>
                  <p>{content.detail}</p>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">
                      Cómo subir
                    </p>
                    <ClimbTaskList
                      tasks={content.climbs}
                      level={level.level}
                      color={level.color}
                    />
                  </div>
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
