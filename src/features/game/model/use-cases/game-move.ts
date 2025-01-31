import { AppDispatch, AppGetState } from "@/shared/store";
import {
  computeWinner,
  getFieldCell,
  updateGameCell,
} from "../domain/game-field";
import { currentIndexIsLast } from "../domain/game-history";
import { getNextGameSymbol } from "../domain/game-status";
import { gameSlice } from "../../store";
import { gameOverEvent, moveCompletedEvent } from "../events";
import { checkTimer } from "./check-timer";
import { incrementTimer, updateTimer } from "../domain/game-timers";

export const gameMove =
  (index: number) => (dispatch: AppDispatch, getState: AppGetState) => {
    dispatch(checkTimer());

    const history = gameSlice.selectors.selectGameHistory(getState());
    const gameStatus = gameSlice.selectors.selectGameStatus(getState());
    const gameField = gameSlice.selectors.selectGameField(getState());
    const gameTimers = gameSlice.selectors.selectGameTimers(getState());

    if (!currentIndexIsLast(history)) {
      return;
    }

    if (gameStatus.type !== "in-progress") {
      return;
    }

    const cell = getFieldCell(gameField, index);

    if (cell !== null) {
      return;
    }

    const nextField = updateGameCell(gameField, index, gameStatus.symbol);
    const winnerIndexes = computeWinner(nextField);

    if (winnerIndexes) {
      dispatch(
        gameOverEvent({
          gameField: nextField,
          gameTimers,
          gameStatus: {
            type: "game-over",
            winner: gameStatus.symbol,
            winnerIndexes: winnerIndexes,
          },
        }),
      );
      return;
    }
    
    const now = new Date().toISOString();

    dispatch(
      moveCompletedEvent({
        gameField: nextField,
        gameTimers: incrementTimer(
          updateTimer({
            timers: gameTimers,
            now,
            start: gameStatus.moveStart,
            symbol: gameStatus.symbol,
          }),
          gameStatus.symbol,
        ),
        gameStatus: {
          type: "in-progress",
          players: gameStatus.players,
          moveStart: now,
          symbol: getNextGameSymbol(
            gameStatus.symbol,
            gameStatus.players,
          ),
        },
      }),
    );
  };
