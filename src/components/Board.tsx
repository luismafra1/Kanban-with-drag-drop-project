import type { BoardState } from "../types";
import { Column } from "./Column";

type BoardProps = {
  board: BoardState;
};

export function Board({ board }: BoardProps) {
  return (
    <div className="size-9/10 mx-auto bg-surface flex flex-col sm:flex-row justify-evenly items-center outline-2 outline-green-400 rounded-sm">
      {board.columnOrder.map((columnId) => {
        const column = board.columns[columnId];
        const cards = column.cardIds.map((cardId) => board.cards[cardId]);
        return <Column key={column.id} column={column} cards={cards} />;
      })}
    </div>
  );
}
