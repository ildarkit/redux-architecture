import { AppDispatch, AppGetState } from "@/shared/store";
import { gameSlice } from "../../store";
import { gameStartedEvent } from "../events";
import { GameSymbol } from "../domain/game-symbol";
import { startCheckTimer } from "./check-timer";

export const startGame =
  () => (dispatch: AppDispatch, getState: AppGetState) => {
  const gameStatus = gameSlice.selectors.selectGameStatus(getState());
  
  if (gameStatus.type === "in-progress")
    return;

  dispatch(
    gameStartedEvent({
      gameStatus: {
        type: "in-progress",
        players: [
          GameSymbol.TRINGLE,
          GameSymbol.SQUARE,
          GameSymbol.ZERO,
          GameSymbol.CROSS,
        ],
        moveStart: new Date().toISOString(),
        symbol: GameSymbol.CROSS,
      }
    })
  );

  startCheckTimer(dispatch);
}
