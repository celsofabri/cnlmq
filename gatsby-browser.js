import "@fontsource/anton/latin-400.css"
import "@fontsource/oswald/latin-500.css"
import "@fontsource/oswald/latin-700.css"
import "@fontsource/nunito/latin-400.css"
import "@fontsource/nunito/latin-700.css"
import "./src/styles/global.css"
import "./src/styles/components.css"

export { wrapPageElement } from "./src/wrap-page"

// Só anima a troca de página a partir da segunda rota (a primeira carga não deve atrasar o LCP).
export const onRouteUpdate = ({ prevLocation }) => {
  if (prevLocation) document.documentElement.dataset.nav = "true"
}
