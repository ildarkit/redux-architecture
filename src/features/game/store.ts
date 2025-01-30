import {
  gameOverEvent,
  gameStartedEvent,
  gameViewedEvent,
  historyViewedEvent,
  moveCompletedEvent,
} from "./model/events";
import { GameStatus, getInitialGameStatus } from "./model/domain/game-status";
import { createEmptyGameField, GameField } from "./model/domain/game-field";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { slicesRegistry } from "@/shared/store";
import { GameHistory } from "./model/domain/game-history";
import { defaultTimers, GameTimers } from "./model/domain/game-timers";

// State
type GameState = {
  history: {
    gameField: GameField;
    gameStatus: GameStatus;
  }[];
  activeIndex: number;
  gameTimers: GameTimers;
};

const initialState: GameState = {
  history: [],
  gameTimers: defaultTimers(),
  activeIndex: 0,
};

export const gameSlice = createSlice({
  name: "features/game",
  initialState,
  reducers: {},
  selectors: {
    selectGameField: (state): GameField =>
      state.history[state.activeIndex]?.gameField ?? createEmptyGameField(),
    selectGameStatus: (state): GameStatus =>
      state.history[state.activeIndex]?.gameStatus ?? getInitialGameStatus(),
    selectGameHistory: (state): GameHistory => {
      return {
        currentIndex: state.activeIndex,
        lastIndex: state.history.length - 1,
      };
    },
    selectGameTimers: (state): GameTimers => state.gameTimers,
  },
  extraReducers: (builder) => {
    builder.addCase(historyViewedEvent, (state, action) => {
      state.activeIndex = action.payload.currentIndex;
    });
    builder.addCase(gameViewedEvent, (state) => {
      state.activeIndex = state.history.length - 1;
    });
    builder.addCase(gameStartedEvent, (state, action) => {
      state.history.push({
        gameField: createEmptyGameField(),
        gameStatus: action.payload.gameStatus,
      });
    });
    builder.addMatcher(
      isAnyOf(moveCompletedEvent, gameOverEvent),
      (state, action) => {
        state.history.push({
          gameField: action.payload.gameField,
          gameStatus: action.payload.gameStatus,
        });
        state.activeIndex++;
        state.gameTimers = action.payload.gameTimers;
      },
    );
  },
});

slicesRegistry.inject(gameSlice);
