import * as React from "react";
import { connect } from "react-redux";
import StartRoundButton from "../StartRoundButton"
import { getRounds, getCurrentRound, getPlayerData, getActioner } from "../../../selectors"
import { ROUND_NUM, TEAM, Round, Player, ROUND_STATUS } from '../../../types/types';
import MenuButton from "./MenuButton"

interface ScoreboardStateProps {
  rounds: Round[];
  currentRound: ROUND_NUM;
  playerData: Player;
  actioner: Player;
}

class Scoreboard extends React.Component<ScoreboardStateProps, any> {
   
    public teamOneScores() {
      const { rounds } = this.props;
      const taboo = rounds[ROUND_NUM.TABOO_ROUND].score[TEAM.ONE];
      const charades = rounds[ROUND_NUM.CHARADE_ROUND].score[TEAM.ONE];
      const password = rounds[ROUND_NUM.PASSWORD_ROUND].score[TEAM.ONE];
      return (    
          <table className="table-sm table-bordered" style={{width:"40%", padding:"0", marginRight:"1rem"}}>
            <thead>
            <tr>
                <th scope="col" colSpan={2}>Team One</th>
              </tr>
              <tr>
                <th scope="col">Round</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="col">Taboo</th>
                <td>{taboo}</td>
              </tr>
              <tr>
                <th scope="col">Charades</th>
                <td>{charades}</td>
              </tr>
              <tr>
                <th scope="col">1-Taboo</th>
                <td>{password}</td>
              </tr>
              <tr>
                <th scope="col">Total</th>
                <td>{taboo + charades + password}</td>
              </tr>
            </tbody>
          </table>
      );
    }

    public teamTwoScores() {
      const { rounds } = this.props;
      const taboo = rounds[ROUND_NUM.TABOO_ROUND].score[TEAM.TWO];
      const charades = rounds[ROUND_NUM.CHARADE_ROUND].score[TEAM.TWO];
      const password = rounds[ROUND_NUM.PASSWORD_ROUND].score[TEAM.TWO];
      return (     
          <table className="table-sm table-bordered" style={{width:"40%", padding:"0"}}>
            <thead>
              <tr>
                <th scope="col" colSpan={2}>Team Two</th>
              </tr>
              <tr>
                <th scope="col">Round</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="col">Taboo</th>
                <td>{taboo}</td>
              </tr>
              <tr>
                <th scope="col">Charades</th>
                <td>{charades}</td>
              </tr>
              <tr>
                <th scope="col">1-Taboo</th>
                <td>{password}</td>
              </tr>
              <tr>
                <th scope="col">Total</th>
                <td>{taboo + charades + password}</td>
              </tr>
            </tbody>
          </table>
      );
    }

    public currentRoundWord() {
      const { currentRound } = this.props;
      switch(currentRound) {
        case ROUND_NUM.TABOO_ROUND:
          return "Taboo Round"
        case ROUND_NUM.CHARADE_ROUND:
          return "Charades Round"
        case ROUND_NUM.PASSWORD_ROUND:
          return "One Word Taboo Round"
        default:
          return "Game Ended"
      }
    }

    public displayStartOrLobbyButton() {
      const { actioner, playerData } = this.props
      if(this.props.currentRound !== ROUND_NUM.END) {
        if(actioner === null) {
         return <StartRoundButton currentRoundWord={this.currentRoundWord()} />
        }
        else {
          if(playerData.team !== actioner.team) {
            return <StartRoundButton currentRoundWord={this.currentRoundWord()} /> 
          }
        }
      }
      else {
        return <MenuButton />
      }
    }

    public displayTeamToStart() {
      if(this.props.currentRound === ROUND_NUM.END) {
        return "Game Ended"
      }
      const played = this.props.rounds[this.props.currentRound].played
      if(!played[TEAM.ONE] && !played[TEAM.TWO]) {
        return "Any team/player may start the round"
      }
      if(this.props.actioner !== null) {
        return this.props.actioner.team === TEAM.ONE ? "Team Two's Turn" : "Team One's Turn";
      }
    }

    public render() {
      return (
        <div>
          <h1 className="ScreenTitle"><u>{this.currentRoundWord()}</u></h1>
          <div className="ScreenSpacing row" style={{paddingBottom:"2rem", margin: "0", justifyContent:"center"}}>
            {this.teamOneScores()}
            {this.teamTwoScores()}
          </div>
          <h5>{this.displayTeamToStart()}</h5>
          {this.displayStartOrLobbyButton()}
        </div>
      );
    }
}
  
const mapStateToProps = state => {
  return {
    rounds: getRounds(state),
    currentRound: getCurrentRound(state),
    playerData: getPlayerData(state),
    actioner: getActioner(state)
  };
};
  
export default connect(mapStateToProps)(Scoreboard);