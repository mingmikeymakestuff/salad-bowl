import * as React from "react";
import { connect } from "react-redux";
import Scoreboard from "./Scoreboard";
import {
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getRoundStatus,
  getCurrentPage,
  getScore,
} from "../../selectors";
import { Player, ROUND_STATUS, ROUND_NUM, GAME_STATUS  } from "../../types/types";

interface GameState {

}

interface GameStateProps {
  id: string;
  players: Player[];
  status?: GAME_STATUS;
  roundStatus?: ROUND_STATUS;
  currentRound: ROUND_NUM;
  score: number[];
  phrases: string[];
}


class Game extends React.Component<GameStateProps, any> {
  constructor(props) {
    super(props);
  }

  public showAnnouncment () {
    const { roundStatus, score } = this.props;
    return (<span>test</span>);
  }


  public render() {
    const { currentRound, roundStatus } = this.props;
    switch (roundStatus) {
      case ROUND_STATUS.SCORE_BOARD:
        return <Scoreboard />
    }
  }
}

const mapStateToProps = state => {
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);

  return {
    players,
    currentRound,
    playerData,
    roundStatus: getRoundStatus(state),
    status: getCurrentPage(state),
    score: getScore(state),
  };
};

export default connect(mapStateToProps)(Game);
