import { DateISOString } from "@/shared/types";
import { GameSymbol } from "./game-symbol";

export type ActivePlayers = GameSymbol[];

export type GameStatusIdle = {
  type: "idle";
};

export type GameStatusInProgress = {
  type: "in-progress";
  symbol: GameSymbol;
  moveStart: DateISOString;
  players: ActivePlayers;
};

export type GameStatusGameOver = {
  type: "game-over";
  winner: GameSymbol;
  winnerIndexes?: number[];
};

export type GameStatus = 
  | GameStatusInProgress 
  | GameStatusGameOver 
  | GameStatusIdle;

export const MOVE_ORDER = [
  GameSymbol.CROSS,
  GameSymbol.ZERO,
  GameSymbol.TRINGLE,
  GameSymbol.SQUARE,
] as const;

export function getNextGameSymbol(
  symbol: GameSymbol,
  players: ActivePlayers,
  ) {
  const symbols = players.length;
  const nextIndex = players
    .filter((orderSymbol) => players.includes(orderSymbol))
    .indexOf(symbol) + 1;
  const newGameSymbol = players[nextIndex % symbols];

  return newGameSymbol;
}

export const getInitialGameStatus = (): GameStatus => ({
  type: "idle",
});

export const checkOneActivePlayer = (
  players: ActivePlayers
): players is [GameSymbol] => players.length === 1;

export const removePlayer = (
  players: ActivePlayers,
  symbol: GameSymbol,
) => players.filter(p => p !== symbol);
