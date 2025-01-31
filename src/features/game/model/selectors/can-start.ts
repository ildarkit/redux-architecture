import { createSelector } from "@reduxjs/toolkit";
import { gameSlice } from "../../store";

export const selectCanStart = createSelector(
  gameSlice.selectors.selectLastGameStatus,
  (gameStatus) => gameStatus.type === "idle",
)
