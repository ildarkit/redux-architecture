import { createAction } from "@reduxjs/toolkit";
import { GameField } from "./domain/game-field";
import { GameHistory } from "./domain/game-history";
import { GameStatusGameOver, GameStatusInProgress } from "./domain/game-status";
import { GameTimers } from "./domain/game-timers";

export const gameStartedEvent = createAction<{
  gameStatus: GameStatusInProgress;
}>("event/game/started");


export const timeOverEvent = createAction<{
  gameStatus: GameStatusInProgress;
  gameTimers: GameTimers;
  gameField: GameField;
}>("event/game/time-over");

export const moveCompletedEvent = createAction<{
  gameField: GameField;
  gameStatus: GameStatusInProgress;
  gameTimers: GameTimers;
}>("event/game/move-completed");

export const gameOverEvent = createAction<{
  gameField: GameField;
  gameStatus: GameStatusGameOver;
  gameTimers: GameTimers;
}>("event/game/over");

export const historyViewedEvent = createAction<GameHistory>(
  "event/game/history-viewed",
);

export const gameViewedEvent = createAction("event/game/game-viewed");
