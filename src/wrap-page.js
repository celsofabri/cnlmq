import React from "react"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Layout } from "./components/Layout"

const loadFeatures = () => import("./lib/motionFeatures").then((mod) => mod.default)

/** Layout persistente (header/footer não remontam) + transição de página por CSS. */
export const wrapPageElement = ({ element, props }) => (
  <MotionConfig reducedMotion="user">
    <LazyMotion features={loadFeatures}>
      <Layout>
        <div key={props.location.pathname} className="page-enter">
          {element}
        </div>
      </Layout>
    </LazyMotion>
  </MotionConfig>
)
