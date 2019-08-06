import { FaCrown } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import StartButton from "./StartButton";
import JoinButton from "./JoinButton";
import Lobby from "../lobby";
import Game from "../game";
import Rejoin from "../rejoin";
import { getCurrentPage } from "../../selectors";
import "../../App.css"

class StartGame extends React.Component<any, any> {
  public render() {
    switch (this.props.currentPage) {
      case "LOBBY":
        return <Lobby />;
      case "IN_PROGRESS":
        return <Game />;
      case "REJOIN":
        return <Rejoin />
      default:
        return (
          <div className="StartGame">
            <div style={{marginBottom: "2rem"}}>
              <h1 className="display-5">🥗<u><b>Salad Bowl</b></u></h1>
              <h5 style={{textAlign:"center"}}>
                Party game where two teams
                <br />
                enter their favorite phrases
                <br />
                and compete to earn the most 
                <br />
                points in these rounds:
                <br />
                <br />
                1. Taboo 
                <br />
                <br />
                2. Charades
                <br />
                <br />
                3. One Word Taboo               
              </h5>
            </div>
            <StartButton />
            <br />
            <h3>OR</h3>
            <br />
            <JoinButton currentPage={this.props.currentPage}/>
          </div>
        );
    }
  }
}

const mapStateToProps = state => ({
  currentPage: getCurrentPage(state)
});

export default connect(mapStateToProps)(StartGame);
