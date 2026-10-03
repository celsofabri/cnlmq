import { useEffect, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"

/**
 * "Agora" para decidir o que é próximo jogo / resultado.
 * No build e na primeira renderização usa o horário do build (evita divergência
 * de hidratação); depois de montado, passa a usar o relógio do visitante.
 */
export function useNow() {
  const { site } = useStaticQuery(graphql`
    {
      site {
        buildTime
      }
    }
  `)
  const [now, setNow] = useState(() => new Date(site.buildTime))
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intencional: troca o horário do build pelo do visitante após hidratar
    setNow(new Date())
  }, [])
  return now
}
