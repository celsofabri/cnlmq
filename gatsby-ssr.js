export { wrapPageElement } from "./src/wrap-page"

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "pt-BR" })
}
