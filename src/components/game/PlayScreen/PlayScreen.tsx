import * as React from "react";
import { connect } from "react-redux";
import { getCurrentRound, getPhrases, getTimer, getPhraseIndex, getPlayerData, getActioner } from "../../../selectors"
import { ROUND_NUM, Player } from '../../../types/types';
import Timer from "./Timer"

interface PlayScreenStateProps {
  currentRound: ROUND_NUM;
  phrases: string[];
  timer: number;
  phraseIndex: number;
  playerData: Player;
  actioner: Player;
}

class PlayScreen extends React.Component<PlayScreenStateProps, any> {
    public intervalHandle;

    constructor(props) {
      super(props);
      this.state = {
        timer: this.props.timer,
        start: false
      }

      this.startCountdown = this.startCountdown.bind(this);
      this.tick = this.tick.bind(this);
    }


    public currentRoundWord() {
      const { currentRound } = this.props;
      switch(currentRound) {
        case ROUND_NUM.TABOO_ROUND:
          return "Taboo"
        case ROUND_NUM.CHARADE_ROUND:
          return "Charades"
        case ROUND_NUM.PASSWORD_ROUND:
          return "One Word Taboo"
        default:
          return "Game Ended"
      }
    }

    public displayPhrase() {
      if(this.state.start === false) {
        return "???"
      }
      const { playerData, actioner, phrases, phraseIndex } = this.props;
      return playerData.socketId !== actioner.socketId ? "???" : phrases[phraseIndex];
    }

    public tick() {
      const secRemaining = this.state.timer - 1;
      this.setState({timer : secRemaining});
      if(secRemaining === 0) {
        clearInterval(this.intervalHandle);
      }
    }

    public startCountdown() {
      this.setState({start: true});
      this.intervalHandle = setInterval(this.tick, 1000);
    }

    public displayOptions() {
      if(this.state.start === false) {
        return <button type="button" className="btn btn-primary" onClick={this.startCountdown}>Start Timer</button>;
      }
      else {
        return "Two buttons"
      }
    }

    public render() {
      return (
        <div>
          <h1 className="ScreenTitle"><u>{this.currentRoundWord()} Round</u></h1>
          <Timer style={{paddingBottom:"2rem"}} timer={this.state.timer}/>
          <h4>{this.displayPhrase()}</h4>
          <h3>{this.displayOptions()}</h3>
        </div>
      );
    }
}
  
const mapStateToProps = state => {
  return {
    currentRound: getCurrentRound(state),
    phrases: getPhrases(state),
    timer: getTimer(state),
    phraseIndex: getPhraseIndex(state),
    playerData: getPlayerData(state),
    actioner: getActioner(state)
  };
};
  
export default connect(mapStateToProps)(PlayScreen);