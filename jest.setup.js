import "@testing-library/jest-dom"

// jsdom não implementa canvas: os efeitos (Embers/Confetti) apenas ficam inativos nos testes.
HTMLCanvasElement.prototype.getContext = () => null
