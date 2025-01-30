import { AppDispatch, AppGetState } from "@/shared/store";
import { gameSlice } from "../../store";
import { gameOverEvent, gameViewedEvent, timeOverEvent } from "../events";
import { checkTimeIsOver, updateTimer } from "../domain/game-timers";
import { currentIndexIsLast } from "../domain/game-history";
import { 
  checkOneActivePlayer,
  getNextGameSymbol,
  removePlayer,
} from "../domain/game-status";

export const startCheckTimer = (dispatch: AppDispatch) => {
  setTimeout(() => {
    dispatch(checkTimer());
  }, 100);
};

export const checkTimer = () =>
(dispatch: AppDispatch, getState: AppGetState) => {
  const gameStatus = gameSlice.selectors.selectLastGameStatus(getState());
  const gameTimers = gameSlice.selectors.selectGameTimers(getState());
  const history = gameSlice.selectors.selectGameHistory(getState());

  if (gameStatus.type !== "in-progress") {
    return;
  }

  startCheckTimer(dispatch);

  const now = new Date().toISOString();

  const newTimers = updateTimer({
    timers: gameTimers,
    now,
    start: gameStatus.moveStart,
    symbol: gameStatus.symbol,
  });

  if (!checkTimeIsOver({ timers: newTimers, symbol: gameStatus.symbol })) {
    return;
  }

  if (!currentIndexIsLast(history)) {
    dispatch(gameViewedEvent());
  }

  const gameField = gameSlice.selectors.selectGameField(getState());

  const players = removePlayer(
    gameStatus.players,
    gameStatus.symbol,
  );

  if (checkOneActivePlayer(players)) {
    dispatch(
      gameOverEvent({
        gameField,
        gameStatus: {
          type: "game-over",
          winner: players[0],
        },
        gameTimers: newTimers,
      })
    );
    return;
  }

  dispatch(
    timeOverEvent({
      gameField,
      gameStatus: {
        type: "in-progress",
        players,
        moveStart: now,
        symbol: getNextGameSymbol(gameStatus.symbol, players),
      },
      gameTimers: newTimers,
    })
  );
}
