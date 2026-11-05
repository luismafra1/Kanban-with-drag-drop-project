import type { AddCardHandler, BoardState, Card as CardData } from "../types";
import { Column } from "./Column";

type BoardProps = {
  board: BoardState;
  onAddCard: AddCardHandler;
};

export function Board({ board, onAddCard }: BoardProps) {
  return (
    <div className="size-9/10 mx-auto bg-surface flex flex-col sm:flex-row justify-evenly items-center border border-border rounded-sm">
      {board.columnOrder.map((columnId) => {
        const column = board.columns[columnId];
        if (!column) return null;
        const cards = column.cardIds
          .map((cardId) => board.cards[cardId])
          .filter((card): card is CardData => card !== undefined);
        return (
          <Column
            key={column.id}
            column={column}
            cards={cards}
            onAddCard={onAddCard}
          />
        );
      })}
    </div>
  );
}
