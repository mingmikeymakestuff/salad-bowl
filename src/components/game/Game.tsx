import * as React from "react";
import { connect } from "react-redux";
import Scoreboard from "./Scoreboard";
import PlayScreen from "./PlayScreen"
import {
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getCurrentPage,
  getRounds,
  getRoundStatus
} from "../../selectors";
import { Player, ROUND_STATUS, GAME_STATUS, Round, ROUND_NUM } from "../../types/types";

interface GameStateProps {
  id: string;
  players: Player[];
  status?: GAME_STATUS;
  roundStatus: ROUND_STATUS
  currentRound: ROUND_NUM;
  rounds: Round[];
  phrases: string[];
}


class Game extends React.Component<GameStateProps, any> {
  constructor(props) {
    super(props);
  }

  public getDisplay() {
      const { roundStatus, currentRound,  rounds } = this.props;
      switch (roundStatus) {
        case ROUND_STATUS.SCORE_BOARD:
          return <Scoreboard />
        case ROUND_STATUS.PLAYING:
          return <PlayScreen />
      }
  
    }
  public render() {
    return (
      <div className="Game">
        {this.getDisplay()}
      </div>
    );
  }

}

const mapStateToProps = state => {
  const players: Player[] = getPlayers(state);
  const currentRound: ROUND_NUM = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);

  return {
    players,
    currentRound,
    playerData,
    status: getCurrentPage(state),
    rounds: getRounds(state),
    roundStatus: getRoundStatus(state)
  };
};

export default connect(mapStateToProps)(Game);
