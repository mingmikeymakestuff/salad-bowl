import { FaRegUser, FaTimes, FaCheck } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import AllRounds from "./AllRounds";
import PlayerList from "./PlayerList/PlayerList";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getRoundStatus,
  getCurrentPage,
  getScore,
} from "../../selectors";
import { Player, ROUND_STATUS, Round, GAME_STATUS, TEAM } from "../../types/types";

interface GameState {
  oldVotes: number[];
  voteOrder: string[];
}

interface GameStateProps {
  curentPlayerTurn: Player;
  players: Player[];
  currentRound: number;
  playerData: Player;
  roundStatus: ROUND_STATUS;
  failedVotes: number;
  rounds: Round[];
  votes: number[];
  status: GAME_STATUS;
  score: number[];
  includes: boolean[];
}

// Initial state so we can reset to this
const initialState = {
  oldVotes: [0, 0],
  voteOrder: []
};

class Game extends React.Component<GameStateProps, any> {
  constructor(props) {
    super(props);
    this.state = initialState
  }

  public showAnnouncment () {
    const { roundStatus, votes, score } = this.props;
    return (<span>test</span>);
  }


  public render() {
    const { players, currentRound, rounds, roundStatus, failedVotes } = this.props;
    return (
      <div className="Game">
        <div style={{minHeight:"85px"}}>{this.showAnnouncment()}</div>
        <AllRounds rounds={rounds} failedVotes={failedVotes} currentRound={currentRound} />
        <div style={{minHeight:"226px"}}>
        <PlayerList/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const curentPlayerTurn: Player = getPlayerDataById(
    state,
    getCurrentPlayerTurn(state)
  );
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);

  return {
    curentPlayerTurn,
    players,
    currentRound,
    playerData,
    roundStatus: getRoundStatus(state),
    status: getCurrentPage(state),
    score: getScore(state),
  };
};

export default connect(mapStateToProps)(Game);
