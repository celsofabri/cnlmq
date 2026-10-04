import React from "react"
import { LazyMotion, MotionConfig } from "framer-motion"

const loadFeatures = () => import("../lib/motionFeatures").then((mod) => mod.default)

/** Carrega o framer-motion só nas telas que precisam (filtros/layout animado) e respeita movimento reduzido. */
export function MotionRoot({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures}>{children}</LazyMotion>
    </MotionConfig>
  )
}
