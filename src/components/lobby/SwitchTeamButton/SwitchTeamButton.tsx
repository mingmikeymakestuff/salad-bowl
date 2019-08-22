import * as React from "react";
import { switchTeam } from '../../../socket';

class SwitchTeamButton extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public handleClick() {
    switchTeam()
  }

  public render() {
    return <button type="button" className="btn btn-secondary" style={{margin:"1rem", fontSize: ".75rem"}} onClick={this.handleClick}>Switch Team</button>;
  }
}
 
export default SwitchTeamButton;