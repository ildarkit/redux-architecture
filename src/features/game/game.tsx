import { PLAYERS } from "./constants";
import { BackLink } from "./ui/back-link";
import { GameCell } from "./ui/game-cell";
import { GameInfo } from "./ui/game-info";
import { GameLayout } from "./ui/game-layout";
import { GameMoveInfo } from "./ui/game-move-info";
import { GameTitle } from "./ui/game-title";
import { PlayerInfo } from "./ui/player-info";
import { GameWinnerInfo } from "./ui/game-winner-info";
import { gameMove } from "./model/use-cases/game-move";
import { GameHistoryView } from "./ui/game-history";
import { historyForward } from "./model/use-cases/history-forward";
import { historyBack } from "./model/use-cases/history-back";
import { backToGame } from "./model/use-cases/back-to-game";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { selectGameHistoryControls } from "./model/selectors/game-history-controls";
import { selectGameMoveInfo } from "./model/selectors/game-move-info";
import { selectGameWinnerInfo } from "./model/selectors/game-winner-info";
import { selectGameCells } from "./model/selectors/game-cells";
import { selectCanStart } from "./model/selectors/can-start";
import { UiButton } from "@/shared/uikit/ui-button";
import { startGame } from "./model/use-cases/start-game";

const PLAYERS_COUNT = 4;

export function Game() {
  const gameHistoryControls = useAppSelector(selectGameHistoryControls);
  const gameMoveInfo = useAppSelector(selectGameMoveInfo);
  const gameWinnerInfo = useAppSelector(selectGameWinnerInfo);
  const gameCells = useAppSelector(selectGameCells);
  const canStart = useAppSelector(selectCanStart);

  const actions = bindActionCreators(
    {
      gameMove,
      historyForward,
      historyBack,
      backToGame,
      startGame,
    },
    useAppDispatch(),
  );

  const handleCellClick = (index: number) => () => actions.gameMove(index);
  const handleForwardClick = () => actions.historyForward();
  const handleBackClick = () => actions.historyBack();
  const handleBackToGameClick = () => actions.backToGame();
  const handleStartGame = () => actions.startGame();

  return (
    <>
      <GameLayout
        backLink={<BackLink />}
        title={<GameTitle />}
        gameInfo={
          <GameInfo isRatingGame playersCount={4} timeMode={"1 мин на ход"} />
        }
        actions={
          canStart ? (
            <UiButton size="md" variant="primary" onClick={handleStartGame}>
              Начать
            </UiButton>
          ) : (
            <GameHistoryView
              controls={gameHistoryControls}
              onBackClick={handleBackClick}
              onForwardClick={handleForwardClick}
              onBackToGameClick={handleBackToGameClick}
            />
          ) 
        }
        playersList={PLAYERS.slice(0, PLAYERS_COUNT).map((player) => {
          return (
            <PlayerInfo
              key={player.id}
              avatar={player.avatar}
              name={player.name}
              rating={player.rating}
              symbol={player.symbol}
            />
          );
        })}
        gameMoveInfo={
          <>
            {gameMoveInfo && <GameMoveInfo {...gameMoveInfo} />}
            {gameWinnerInfo && <GameWinnerInfo {...gameWinnerInfo} />}
          </>
        }
        gameCells={gameCells.map((cell, index) => (
          <GameCell
            key={index}
            index={index}
            isWinner={cell.isWinner}
            disabled={false}
            onClick={handleCellClick(index)}
            symbol={cell.symbol}
          />
        ))}
      />
    </>
  );
}
