import { createSelector } from "@reduxjs/toolkit";
import { GameStatus, getNextGameSymbol } from "../domain/game-status";
import { gameSlice } from "../../store";

export const selectGameMoveInfo = createSelector(
  gameSlice.selectors.selectGameStatus,
  (gameStatus: GameStatus) => {
    if (gameStatus.type === "in-progress") {
      return {
        currentSymbol: gameStatus.symbol,
        nextSymbol: getNextGameSymbol(
          gameStatus.symbol,
          gameStatus.players,
        ),
      };
    }

    return undefined;
  },
);
