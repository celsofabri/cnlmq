import React from "react"
import { Layout } from "./components/Layout"

/** Layout persistente (header/footer não remontam) + transição de página por CSS. */
export const wrapPageElement = ({ element, props }) => (
  <Layout pathname={props.location.pathname}>
    <div key={props.location.pathname} className="page-enter">
      {element}
    </div>
  </Layout>
)
