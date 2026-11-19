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
      payload: MoveCardInput;
    };

export type DialogState =
  | { mode: "create"; columnId: string }
  | { mode: "edit"; cardId: string }
  | null;

export type AddCardHandler = (
  columnId: string,
  title: string,
  description?: string,
) => void;

export type DeleteCardHandler = (cardId: string) => void;

export type UpdateCardHandler = (
  cardId: string,
  title: string,
  description?: string,
) => void;

export type MoveCardInput = {
  sourceColumnId: string;
  destinationColumnId: string;
  cardId: string;
  destinationIndex: number;
};

export type MoveCardHandler = (input: MoveCardInput) => void;

export type MoveColumnOption = {
  id: string;
  title: string;
  cardCount: number;
};
