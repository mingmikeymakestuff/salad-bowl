import * as React from "react";
import { connect } from "react-redux";
import { resetToLobby } from "../../../../socket";

class MenuButton extends React.Component<any, any> {
    public render() {
      const { onClick } = this.props;
      return <button type="button" className="btn btn-primary" style={{margin:"1rem", fontSize: ".75rem"}} onClick={onClick}>Back to Lobby</button>;
    }
}
  
const mapDispatchToProps = dispatch => ({
    onClick: () => {
      resetToLobby();
    }
});
  
export default connect(undefined, mapDispatchToProps)(MenuButton);
  