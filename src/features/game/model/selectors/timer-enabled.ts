import { createSelector } from "@reduxjs/toolkit";
import { gameSlice } from "../../store";
import { AppState } from "@/shared/store";
import { GameSymbol } from "../domain/game-symbol";

const selectSymbol = (_: AppState, { symbol }: { symbol: GameSymbol }) =>
  symbol;

export const selectTimerEnabled = createSelector(
  gameSlice.selectors.selectLastGameStatus,
  selectSymbol,
  (gameStatus, symbol) => {
    return gameStatus.type === "in-progress" &&
      gameStatus.symbol === symbol;
  },
);
