import * as React from "react";
import { connect } from "react-redux";
import { getCurrentRound, getPhrases, getTimer } from "../../../selectors"
import { ROUND_NUM } from '../../../types/types';

interface PlayScreenStateProps {
  currentRound: ROUND_NUM;
  phrases: string[];
  timer: number;
}

class PlayScreen extends React.Component<PlayScreenStateProps, any> {

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

    public render() {
      return (
        <div>
          <h1><u>{this.currentRoundWord()} Round</u></h1>
          <h4>Timer</h4>
          <h4>Phrase</h4>
          <h3>button button</h3>
        </div>
      );
    }
}
  
const mapStateToProps = state => {
  return {
    currentRound: getCurrentRound(state),
    phrases: getPhrases(state),
    timer: getTimer(state)
  };
};
  
export default connect(mapStateToProps)(PlayScreen);