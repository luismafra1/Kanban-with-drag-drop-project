export interface Card {
  id: string;
  title: string;
  description?: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export type BoardAction =
  | { type: "ADD_CARD"; payload: { columnId: string; card: Card } }
  | { type: "DELETE_CARD"; payload: { cardId: string } }
  | {
      type: "UPDATE_CARD";
      payload: { cardId: string; title?: string; description?: string };
    }
  | {
      type: "MOVE_CARD";
      payload: {
        sourceColumnId: string;
        destinationColumnId: string;
        cardId: string;
        // Posicao final do card em 'cardIds' da coluna de destino, depois da movimentacao
        destinationIndex: number;
      };
    };

export type AddCardHandler = (
  columnId: string,
  title: string,
  description?: string,
) => void;
