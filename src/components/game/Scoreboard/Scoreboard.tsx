import * as React from "react";
import { connect } from "react-redux";
import { joinGame } from "../../../socket";

class Scoreboard extends React.Component<any, any> {
    
    // Join Game
    public handleClick() {
      joinGame(this.state.value);
    }
    
 
    public render() {
      return (
        <div>
test
        </div>
      );
    }
}
  
const mapDispatchToProps = dispatch => ({});
  
export default connect(undefined,mapDispatchToProps)(Scoreboard);