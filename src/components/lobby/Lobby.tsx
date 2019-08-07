import { FaRegUser, FaUser } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers, getPlayerData, getPhraseCount } from "../../selectors";
import StartButton from "./StartButton";
import { updateNickName, addPhrase } from "../../socket";
import MenuButton from './MenuButton';
import { Player } from '../../types/types';

interface LobbyPropsFromState {
  gameId: string;
  playerCount: number;
  playerData: Player;
  playerList: Player[];
  phraseCount: number;
}

interface LobbyState {
  value: string;
  tooltip: boolean;
  phrase: string;
}

class Lobby extends React.Component<LobbyPropsFromState, LobbyState> {
  constructor(props) {
    super(props);
    this.state = { 
      value: "",
      tooltip: false,
      phrase: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePhraseChange = this.handlePhraseChange.bind(this);
    this.handlePhraseClick = this.handlePhraseClick.bind(this);
  }

  // Changes in nickname input box reflected in value state
  public handleChange(event) {
    this.setState({ value: event.target.value });
  }
  
  // Changes in phrase input box reflected in value state
  public handlePhraseChange(event) {
    this.setState({ phrase: event.target.value });
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

  public playerSelf(socketId) {
    const { playerData } = this.props
    if(playerData === undefined) {
      return <FaRegUser style={{fontSize:"1rem"}}/>
    }
    return playerData.socketId === socketId ? <FaUser className="PlayerPicked" style={{fontSize:"1rem"}}/> : <FaRegUser style={{fontSize:"1rem"}}/>
  }

  public playerList() {
    const { playerList } = this.props
    return (playerList.map(player => (
      <div className="col-6 col-lg-12" key={player.socketId}>
        {this.playerSelf(player.socketId)}
        {player.nickName}
      </div>)));
  }

  public render() {
    const { gameId, playerCount, phraseCount } = this.props;
    return (
      <div className="Lobby">
        <h3 style={{wordBreak:"break-all"}}><u>Game ID:<br/>{gameId}</u></h3>
        <h4>{playerCount} player(s) connected: </h4>
        <br />
        <div className="row" style={{width:"75%", paddingBottom:"1rem"}}>{this.playerList()}</div>
          <div>
            <div className="NickTooltip input-group mb-3">
              <input type="text" value={this.state.value} onChange={this.handleChange}
                    placeholder={this.getNick()} className="form-control" />
              <div className="input-group-append">
                <button type="button" className="NicknameButton btn btn-outline-secondary" onClick={this.handleClick}>Update Nickname</button>
              </div>
            </div>
            {this.showNickTooltip()}
          </div>
          <br />
          <div>
            <div>Total phrases: {phraseCount}</div>
            <div className="input-group mb-3">
              <input type="text" value={this.state.phrase} onChange={this.handlePhraseChange}
                      placeholder={this.getPhrase()} className="form-control" />
              <div className="input-group-append">
                <button type="button" className="PhraseButton btn btn-outline-secondary" onClick={this.handlePhraseClick}>Submit Phrase</button>
              </div>
            </div>
          </div>
        <div>
          <StartButton phraseCount={phraseCount}/>
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
    phraseCount: getPhraseCount(state)
  };
};

export default connect(mapStateToProps)(Lobby);
