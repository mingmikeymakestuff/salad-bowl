import * as React from "react";
import { randomizeTeams } from 'socket';

class RandomizeButton extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
   
  public handleClick() {
    randomizeTeams()
  }

  public render() {
    return <button type="button" className="btn btn-secondary" style={{margin:"1rem", fontSize: ".75rem"}}  onClick={this.handleClick}>Randomize</button>;
  }
}
 
export default RandomizeButton;