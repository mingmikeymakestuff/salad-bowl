import * as io from "socket.io-client";
import { setGameData, navigateTo } from "../actions";
import { setSocketId } from "../actions";

const port = process.env.PORT 
const socket = io("http://localhost:8888");
export class SocketListener {
  constructor(store) {
    socket.on("JOINED_GAME", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("GAME_STARTING", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("UPDATE_GAME_STATE", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("SET_SOCKET_ID", socketId => {
      store.dispatch(setSocketId(socketId));
    });

    socket.on("NAV_MAIN_MENU", destination => {
      store.dispatch(navigateTo(destination));
    });
  }
}

export const createNewGame = () => {
  console.log("Client creating a new game");
  socket.emit("NEW_GAME");
};

export const mainMenu = () => {
  console.log("Client leaving game to Main menu");
  socket.emit("MAIN_MENU");
};

export const joinGame = gameId => {
  console.log(`Client joining game with id ${gameId}`);
  socket.emit("JOIN_GAME", gameId);
};

export const startGame = () => {
  console.log(`Client started game`);
  socket.emit("START_GAME");
};

export const switchTeam = () => {
  socket.emit("SWITCH_TEAM");
};

export const randomizeTeams = () => {
  socket.emit("RANDOMIZE_TEAMS");
};

export const updateTimer = timer => {
  socket.emit("UPDATE_TIMER", timer);
};

export const addPhrase = (phrase: string) => {
  console.log(`Client added phrase: ${phrase}`);
  socket.emit("ADD_PHRASE", phrase);
};

export const updateNickName = (nickName: string) => {
  socket.emit("UPDATE_NICKNAME", nickName);
};

export const startRound = () => {
  socket.emit("START_ROUND");
}

export const rejoinGame = (nickname: string) => {
  socket.emit("REJOIN_GAME", nickname);
};



