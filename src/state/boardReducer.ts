import type { BoardAction, BoardState } from "../types";

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  switch (action.type) {
    case "ADD_CARD": {
      const { columnId, card } = action.payload;
      const column = state.columns[columnId];
      if (!column) return state; // Column doesn't exist, return current state or handle the error as needed
      if (state.cards[card.id]) return state; // Card with the same ID already exists, return current state or handle the error as needed
      const newCards = { ...state.cards, [card.id]: card };
      const newColumns = {
        ...state.columns,
        [columnId]: {
          ...column,
          cardIds: [...column.cardIds, card.id],
        },
      };
      return { ...state, cards: newCards, columns: newColumns };
    }

    case "DELETE_CARD": {
      const { cardId } = action.payload;
      if (!state.cards[cardId]) return state; // Card doesn't exist, return current state or handle the error as needed
      const newCards = { ...state.cards };
      delete newCards[cardId];

      const newColumns = Object.fromEntries(
        Object.entries(state.columns).map(([columnId, column]) => [
          columnId,
          {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
          },
        ]),
      );

      return { ...state, cards: newCards, columns: newColumns };
    }

    case "UPDATE_CARD": {
      const { cardId, title, description } = action.payload;
      const card = state.cards[cardId];

      if (!card) return state; // Card doesn't exist, return current state or handle the error as needed

      const updatedCard = { ...card };
      if (title !== undefined) updatedCard.title = title;
      if (description !== undefined) updatedCard.description = description;

      return {
        ...state,
        cards: { ...state.cards, [cardId]: updatedCard },
      };
    }

    case "MOVE_CARD": {
      const { sourceColumnId, destinationColumnId, cardId, destinationIndex } =
        action.payload;

      const sourceColumn = state.columns[sourceColumnId];
      const destinationColumn = state.columns[destinationColumnId];

      if (!sourceColumn || !destinationColumn) return state; // One of the columns doesn't exist, return current state or handle the error as needed
      if (!state.cards[cardId] || !sourceColumn.cardIds.includes(cardId))
        return state; // Card doesn't exist in the source column, return current state

      // Remove the card from the source column
      const newSourceCardIds = sourceColumn.cardIds.filter(
        (id) => id !== cardId,
      );

      const baseIds =
        sourceColumnId === destinationColumnId
          ? newSourceCardIds
          : destinationColumn.cardIds;

      const index = Math.max(0, Math.min(destinationIndex, baseIds.length));
      const newDestinationCardIds = [
        ...baseIds.slice(0, index),
        cardId,
        ...baseIds.slice(index),
      ];

      const newColumns = {
        ...state.columns,
        [sourceColumnId]: { ...sourceColumn, cardIds: newSourceCardIds },
        [destinationColumnId]: {
          ...destinationColumn,
          cardIds: newDestinationCardIds,
        },
      };

      return { ...state, columns: newColumns };
    }

    default: {
      const _exhaustiveCheck: never = action;
      void _exhaustiveCheck; // This line ensures that all action types are handled. If a new action type is added and not handled, TypeScript will throw an error here.
      return state;
    }
  }
}
