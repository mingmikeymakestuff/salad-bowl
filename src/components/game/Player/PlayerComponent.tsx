import * as React from "react";
import { ROUND_STATUS, Player } from "../../../types/types";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getRoundStatus
} from "../../../selectors";
import { connect } from "react-redux";

interface PlayerComponentOwnProps {
  readonly key: number;
  readonly player: Player;
}

interface PlayerComponentStateProps {
  readonly currentPlayerTurn: Player;
  readonly players: Player[];
  readonly currentRound: number;
  readonly playerData: Player;
  readonly roundStatus: ROUND_STATUS;
}

interface PlayerComponentProps
  extends PlayerComponentOwnProps,
    PlayerComponentStateProps {}

class PlayerComponent extends React.Component<PlayerComponentProps, any> {

  public render() {
    const { player } = this.props;
    return (
      <div className="PlayerCol col">
        players
      </div>
    );
  }
}

const mapStateToProps = (state: any): PlayerComponentStateProps => {
  const currentPlayerTurn: Player = getPlayerDataById(
    state,
    getCurrentPlayerTurn(state)
  );
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);
  const roundStatus = getRoundStatus(state);

  return {
    playerData,
    currentPlayerTurn,
    players,
    currentRound,
    roundStatus
  };
};

export default connect(mapStateToProps)(PlayerComponent);
