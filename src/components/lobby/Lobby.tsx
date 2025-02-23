import { FaRegUser, FaUser } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers, getPlayerData, getPhraseCount, getTimer } from "../../selectors";
import StartButton from "./StartButton";
import SwitchTeamButton from "./SwitchTeamButton";
import RandomizeButton from "./RandomizeButton";
import { updateNickName, addPhrase, updateTimer } from "../../socket";
import MenuButton from './MenuButton';
import { Player, TEAM } from '../../types/types';

interface LobbyPropsFromState {
  gameId: string;
  playerCount: number;
  playerData: Player;
  playerList: Player[];
  phraseCount: number;
  timer: number
}

interface LobbyState {
  value: string;
  tooltip: boolean;
  phrase: string;
  disableStart: boolean;
}

class Lobby extends React.Component<LobbyPropsFromState, LobbyState> {
  constructor(props) {
    super(props);
    this.state = { 
      value: "",
      tooltip: false,
      phrase: "",
      disableStart: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePhraseChange = this.handlePhraseChange.bind(this);
    this.handlePhraseClick = this.handlePhraseClick.bind(this);
    this.handleTimerChange = this.handleTimerChange.bind(this);
  }

  // Changes in nickname input box reflected in value state
  public handleChange(event) {
    this.setState({ value: event.target.value });
  }
  
  // Changes in phrase input box reflected in value state
  public handlePhraseChange(event) {
    this.setState({ phrase: event.target.value });
  }

  // Changes in timer input box reflected in value state
  public handleTimerChange(event) {
    const changedTimer = parseInt(event.target.value, 10)
    if(isNaN(changedTimer)) {
      this.setState({disableStart: true})
      updateTimer(null);
    } else {
      this.setState({disableStart: false})
      updateTimer(changedTimer);
    }
  }

  public computeTimerVal() {
    const { timer } = this.props;
    return timer === null ? '' : timer
  }

  // On clicking update nick, checks if its between 1-7 characters and unique
  public handleClick() {
    const { playerList } = this.props
    const nick = this.state.value.trim()
    const dupNick = playerList.findIndex(player => player.nickName === nick);
    if(nick.length >= 1 && nick.length < 8 && dupNick === -1)
    { 
      updateNickName(this.state.value.trim());
      this.setState({ tooltip: false });
    } else {
      this.setState({ tooltip: true });
    }
  }

  // On clicking submit phrase
  public handlePhraseClick() {
    const phrase = this.state.phrase.trim()
    if(phrase.length === 0) {
      return;
    }
    addPhrase(this.state.phrase.trim());
    this.setState({phrase: ""});
  }

  // Nickname input box display 
  public getNick() {
    if(this.props.playerData === undefined)
    {
      return "Nickname";
    }
    else
    {
      return this.props.playerData.nickName;
    }
  }

  // Phrase input box display 
  public getPhrase() {
    return "Enter a phrase";
  }

  // Tooltip
  public showNickTooltip() {
    if(this.state.tooltip) {
      return (<span className="Warning">Nickname must be unique and 1-7 letters</span>);
    } 
  }

  // Tooltip
  public showTimerTooltip() {
    if(this.state.disableStart) {
      return (<span className="Warning" style={{fontSize: ".75rem"}}>Must be an integer</span>);
    } 
  }

  public playerSelf(socketId) {
    const { playerData } = this.props
    if(playerData === undefined) {
      return <FaRegUser style={{fontSize:"1rem"}}/>
    }
    return playerData.socketId === socketId ? <FaUser className="PlayerPicked" style={{fontSize:"1rem"}}/> : <FaRegUser style={{fontSize:"1rem"}}/>
  }

  public playerTables() {
    const { playerList } = this.props
    const teamOnePlayers = playerList.filter(player => player.team === TEAM.ONE);
    const teamOneTable = teamOnePlayers.map(player => (<tr key={player.socketId}><td>{this.playerSelf(player.socketId)}{player.nickName}</td></tr>))
    const teamTwoPlayers = playerList.filter(player => player.team === TEAM.TWO);
    const teamTwoTable = teamTwoPlayers.map(player => (<tr key={player.socketId}><td>{this.playerSelf(player.socketId)}{player.nickName}</td></tr>))
    return ( 
      <div className="row" style={{width:"80%", paddingBottom:"1rem", justifyContent:"center"}}>      
        <table className="table-sm table-bordered" style={{width:"40%", padding:"0", marginRight:"1rem"}}>
          <thead>
            <tr>
              <th scope="col">Team One</th>
            </tr>
          </thead>
          <tbody>
            {teamOneTable}
          </tbody>
        </table>
        <table className="table-sm table-bordered" style={{width:"40%", padding:"0"}}>
          <thead>
            <tr>
              <th scope="col">Team Two</th>
            </tr>
          </thead>
          <tbody>
            {teamTwoTable}
          </tbody>
        </table>
      </div>
    );
  }

  public render() {
    const { gameId, phraseCount } = this.props;
    return (
      <div className="Lobby">
        <h4 style={{wordBreak:"break-all"}}><u>Game ID:<br/>{gameId}</u></h4>
        <div>
          <SwitchTeamButton />
          <RandomizeButton />
        </div>
        {this.playerTables()}
        <div>
          <div className="NickTooltip input-group mb-3">
            <input type="text" value={this.state.value} onChange={this.handleChange}
                  placeholder={this.getNick()} className="form-control" style={{fontSize: ".75rem"}}/>
            <div className="input-group-append">
              <button type="button" style={{fontSize: ".75rem"}} className="NicknameButton btn btn-outline-secondary" onClick={this.handleClick}>Update Nickname</button>
            </div>
          </div>
          {this.showNickTooltip()}
        </div>
        <br />
        <div>
          <h5>Total phrases: {phraseCount}</h5>
          <div className="input-group mb-3">
            <input type="text" value={this.state.phrase} onChange={this.handlePhraseChange}
                    placeholder={this.getPhrase()} className="form-control" style={{fontSize: ".75rem"}}/>
            <div className="input-group-append">
              <button type="button" style={{fontSize: ".75rem"}} className="PhraseButton btn btn-outline-secondary" onClick={this.handlePhraseClick}>Submit Phrase</button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <input type="text" id="timerBox" value={this.computeTimerVal()} onChange={this.handleTimerChange} maxLength={4} className="TimerInput form-control"/>
            <span>Seconds per team</span>
            <br/>
            {this.showTimerTooltip()}
          </div>
          <StartButton disableStart={this.state.disableStart} phraseCount={phraseCount}/>
          <MenuButton />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {

  const playerList: Player[] = getPlayers(state);
  const playerData: Player = getPlayerData(state);

  return {
    gameId: getGameId(state),
    playerCount: getPlayerCount(state),
    playerList,
    playerData,
    phraseCount: getPhraseCount(state),
    timer: getTimer(state)
  };
};

export default connect(mapStateToProps)(Lobby);
