import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/* Limitacao: Quando o card e inserido em outra coluna sobre um outro card,
a funcao getMoveFromDrag insere ANTES, nao depois. A correcao e comparar a
posicao do card arrastado com o centro do card alvo e somar 1 ao indice.
Isso exige passar a informacao como parametro extra.
*/
