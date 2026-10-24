import type { BoardState } from "../types";

const initial: BoardState = {
  cards: {
    c1: { id: "c1", title: "Study React" },
    c2: { id: "c2", title: "Fix footer" },
  },
  columns: {
    todo: { id: "todo", title: "To do", cardIds: ["c1", "c2"] },
    doing: { id: "doing", title: "Doing", cardIds: [] },
    done: { id: "done", title: "Done", cardIds: [] },
  },
  columnOrder: ["todo", "doing", "done"],
};

export function Board() {
  return (
    <div className="board size-9/10 mx-auto bg-red-200 flex flex-col sm:flex-row justify-evenly items-center outline-2 outline-green-400 rounded-sm">
      {initial.columnOrder.map((column: string) => (
        <div
          key={initial.columns[column].id}
          className="column bg-gray-200 flex flex-col p-2 h-3/10 sm:h-9/10 w-9/10 sm:w-1/4 outline-1 outline-purple-300 rounded-sm gap-2"
        >
          <h2 className="column-title text-xl text-center font-bold bg-yellow-300 rounded-sm p-1 rounded-sm">
            {initial.columns[column].title}
          </h2>
          <div className="card-container flex-auto bg-green-500 flex sm:flex-col justify-start items-center rounded-sm gap-2 pl-2 sm:pt-2 sm:px-2">
            {initial.columns[column].cardIds.map((card: string) => (
              <div
                key={initial.cards[card].id}
                className="card bg-gray-400 rounded-sm w-auto h-4/5 sm:h-auto sm:w-4/5 p-2 font-medium text-center"
              >
                {initial.cards[card].title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
