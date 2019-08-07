import * as React from "react";
import PlayerComponent from "../Player";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getRoundStatus
} from "../../../selectors";
import { Player, ROUND_STATUS } from "../../../types/types";
import { connect } from "react-redux";

interface PlayerListState {
  playerNeededTooltip : boolean;
}

interface PlayerListProps {
  players: Player[];
  turnToPick: boolean;
  roundStatus: ROUND_STATUS;
  currentRound: number;
  currentPlayerTurn: Player[];
}

class PlayerList extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { 
      playerNeededTooltip: false,
      accept: true,
      reject: true,
      merlinNeededTooltip: false
    };
  }

  // Returns 5 players in first row 
  public firstPlayerRow() {
    const firstRow = this.props.players.slice(0, 5);
    return firstRow.map(player => (<PlayerComponent key={player.socketId.toString()} player={player} />));
  }
  
  // Returns second 5 players in second row
  public secondPlayerRow() {
    const firstRow = this.props.players.slice(5, 10);
    return firstRow.map(player => (<PlayerComponent key={player.socketId.toString()} player={player} />))
  }

  public render() {
    return (
      <div className="PlayerList">
        <div className="row">
          {this.firstPlayerRow()}
        </div>
        <div className="row">
          {this.secondPlayerRow()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const currentPlayerTurn: Player = getPlayerDataById(
    state,
    getCurrentPlayerTurn(state)
  );
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);
  const turnToPick = playerData.socketId === currentPlayerTurn.socketId;
  const roundStatus = getRoundStatus(state);

  return {
    players,
    turnToPick,
    roundStatus,
    currentRound,
    playerData,
    currentPlayerTurn 
  };
};

export default connect(mapStateToProps)(PlayerList);
