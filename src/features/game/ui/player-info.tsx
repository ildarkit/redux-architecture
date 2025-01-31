import { GameSymbolView } from "./game-symbol";
import clsx from "clsx";
import { GameSymbol } from "../model/domain/game-symbol";
import { useNow } from "@/shared/lib/timers";
import { useAppSelector } from "@/shared/store";
import { selectGameTimers } from "../model/selectors/game-timers";
import { selectTimerEnabled } from "../model/selectors/timer-enabled";

export function PlayerInfo({
  isRight = false,
  name,
  rating,
  avatar,
  symbol,
}: {
  isRight?: boolean;
  name: string;
  rating: number;
  avatar: string;
  symbol: GameSymbol;
}) {
  const isTimerEnabled = useAppSelector(
    state => selectTimerEnabled(state, { symbol })
  );
  const now = useNow(1000, isTimerEnabled);
  const timers = useAppSelector(
    state => selectGameTimers(state, { now })
  );

  const mils = timers[symbol];
  const seconds = Math.ceil(mils / 1000);
  const minutesString = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsString = String(seconds % 60).padStart(2, "0");

  const isDanger = seconds < 10;

  const getTimerColor = () => {
    if (isTimerEnabled) {
      return isDanger ? "text-orange-600" : "text-slate-900";
    }
    return "text-slate-200";
  };

  return (
    <div className="flex gap-3 items-center">
      <div className={clsx("relative", isRight && "order-3")}>
        <div
          className={"flex items-center gap-2 text-start text-teal-600 w-44"}
        >
          <img src={avatar} width={48} height={48} alt="avatar" />
          <div className="overflow-hidden">
            <div className=" text-lg leading-tight truncate ">{name}</div>
            <div className="text-slate-400 text-xs leading-tight">
              Рейтинг: {rating}
            </div>
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-white shadow absolute -left-1 -top-1 flex items-center justify-center">
          <GameSymbolView symbol={symbol} />
        </div>
      </div>
      <div className={clsx("h-6 w-px bg-slate-200", isRight && "order-2")} />
      <div
        className={clsx(
          " text-lg font-semibold w-[60px]",
          isRight && "order-1",
          getTimerColor(),
        )}
      >
        {minutesString}:{secondsString}
      </div>
    </div>
  );
}
