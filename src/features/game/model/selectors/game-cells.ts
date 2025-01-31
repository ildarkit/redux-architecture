import { createSelector } from "@reduxjs/toolkit";
import { GameSymbol } from "../domain/game-symbol";
import { gameSlice } from "../../store";

type GameCell = {
  symbol: GameSymbol | null;
  isWinner: boolean;
};

export const selectGameCells = createSelector(
  gameSlice.selectors.selectGameField,
  gameSlice.selectors.selectGameStatus,
  (gameField, gameStatus) => {
    if (gameStatus.type === "game-over") {
      return gameField.map((cell, index): GameCell => {
        return {
          symbol: cell,
          isWinner: gameStatus.winnerIndexes?.includes(index) ?? false,
        };
      });
    }
    return gameField.map((cell): GameCell => {
      return {
        symbol: cell,
        isWinner: false,
      };
    });
  },
);
