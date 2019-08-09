import * as React from "react";
import { connect } from "react-redux";
import { startGame } from 'socket';
import { getPhraseCount } from 'selectors';

class StartButton extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public disableStart() {
    const { phraseCount } = this.props;
    return phraseCount <= 0 || this.props.disableStart
  }
    
  public handleClick() {
    startGame()
  }

  public render() {
    return <button type="button" className="btn btn-primary" style={{margin:"1rem", fontSize: ".75rem"}} disabled={this.disableStart()} onClick={this.handleClick}>Start</button>;
  }
}

const mapStateToProps = state => {
  return {
    phraseCount: getPhraseCount(state)
  };
};
 
export default connect(mapStateToProps)(StartButton);