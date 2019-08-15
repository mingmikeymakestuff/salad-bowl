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

interface PlayScreenState {
  timer: number;
  start: boolean;
  phrases: string[]
}

class PlayScreen extends React.Component<PlayScreenStateProps, PlayScreenState> {
    public intervalHandle;

    constructor(props) {
      super(props);
      this.state = {
        timer: this.props.timer,
        start: false,
        phrases: this.props.phrases
      }

      this.startCountdown = this.startCountdown.bind(this);
      this.tick = this.tick.bind(this);
      this.skipPhrase = this.skipPhrase.bind(this);
      this.correctPhrase = this.correctPhrase.bind(this);
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
        // FIXME Go to scoreboard server
      }
    }

    public startCountdown() {
      this.setState({start: true});
      this.intervalHandle = setInterval(this.tick, 1000);
    }

    public skipPhrase() {
      this.state.phrases.push(this.state.phrases.splice(this.props.phraseIndex, 1)[0]);
    }

    public correctPhrase() {
      return 5;
    }

    public displayOptions() {
      if(this.state.start === false) {
        return <button style={{marginTop:"3rem"}} type="button" className="btn btn-primary" onClick={this.startCountdown}>Start Timer</button>;
      }
      else {
        return (
          <div style={{marginTop:"3rem"}}>
            <button style={{margin:"1rem"}} type="button" className="btn btn-primary" onClick={this.skipPhrase}>Skip Phrase</button>
            <button style={{margin:"1rem"}} type="button" className="btn btn-primary" onClick={this.correctPhrase}>Correct</button>
          </div>
        );
      }
    }

    public render() {
      return (
        <div>
          <h1 className="ScreenTitle"><u>{this.currentRoundWord()} Round</u></h1>
          <Timer timer={this.state.timer}/>
          <h3 className="ScreenSpacing" style={{wordBreak:"break-all"}}>{this.displayPhrase()}</h3>
          <div>{this.displayOptions()}</div>
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