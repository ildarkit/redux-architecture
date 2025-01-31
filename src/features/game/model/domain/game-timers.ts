import { DateISOString } from '@/shared/types';
import { GameSymbol } from './game-symbol';

export type GameTimerValuesMs = number;

export type GameTimers = Record<GameSymbol, number>;

const INCREMENT_PER_MOVE: GameTimerValuesMs = 2 * 1000;
const DEFAULT_TIMER: GameTimerValuesMs = 10 * 1000;

export function defaultTimers(): GameTimers {
 return {
   [GameSymbol.CROSS]: DEFAULT_TIMER,
   [GameSymbol.ZERO]: DEFAULT_TIMER,
   [GameSymbol.SQUARE]: DEFAULT_TIMER,
   [GameSymbol.TRINGLE]: DEFAULT_TIMER,
 }; 
}

export function updateTimer({
  timers,
  now,
  start,
  symbol,
}: {
  timers: GameTimers,
  now: DateISOString,
  start: DateISOString,
  symbol: GameSymbol,
}) {
  const timer = timers[symbol];
  const diffTime = Date.parse(now) - Date.parse(start);

  return {
    ...timers,
    [symbol]: Math.max(timer - diffTime, 0),
  };
}

export function incrementTimer(
  timers: GameTimers,
  symbol: GameSymbol,
) {
  const timer = timers[symbol];

  return {
    ...timers,
    [symbol]: timer + INCREMENT_PER_MOVE, 
  };
}

export function checkTimeIsOver({
  timers,
  symbol
}: {
  timers: GameTimers,
  symbol: GameSymbol,
}) {
  return timers[symbol] <= 0;
}
