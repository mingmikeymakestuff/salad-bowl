import * as randomWord from "random-word";
import * as socketIo from "socket.io";
import {
  Game,
  Player,
  GAME_STATUS,
  ROUND_STATUS,
  ROUND_NUM,
  TEAM,
} from "./src/types/types";

const port = process.env.PORT || 8888;
const io = socketIo.listen(port);
// declare var require: any
// declare var  __dirname: any
// declare var process: any

// const express = require('express');
// const path = require('path');
// const port = process.env.PORT || 8080;
// const app = express();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
// // the __dirname is the current directory from where the script is running
// app.use(express.static(__dirname));

// // send the user to index html page inspite of the url
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname,  'index.html'));
// });
// server.listen(port);

const gamesById: { string?: Game } = {};

/* Random Word */
function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getRandomWord() {
  return capitalizeFirstLetter(randomWord());
}

// Returns random word of shorter than nameLength
function getRandomName(nameLength) {
  let name = capitalizeFirstLetter(randomWord());
  while(name.length > nameLength) {
    name = capitalizeFirstLetter(randomWord());
  }
  return name;
}
/* Random Word */

/* Get Game */
const getGameIdBySocket = socket => {
  const rooms = Object.keys(socket && socket.rooms);
  return rooms && rooms[rooms.length - 1];
};

const getGameBySocket = socket => {
  return getGameById(getGameIdBySocket(socket));
};

const getGameById = gameId => {
  return gamesById[gameId];
};
/* Get Game */

/* Init */
const createNewGame = () => {
  let id = getRandomWord() + getRandomWord()
  while( gamesById[id] !== undefined) {
    id = getRandomWord() + getRandomWord()
  }
  const game = {
    players: [],
    status: GAME_STATUS.LOBBY,
    id,
    currentRound: 1,
    rounds: [
      { id: ROUND_NUM.TABOO_ROUND, score: [0,0], played: [false, false]},
      { id: ROUND_NUM.CHARADE_ROUND, score: [0,0], played: [false, false]},
      { id: ROUND_NUM.PASSWORD_ROUND, score: [0,0], played: [false, false]}
    ],
    phrases: [],
    roundStatus: ROUND_STATUS.SCORE_BOARD,
    phraseIndex: 0,
    timer: 60
  };
  gamesById[id] = game;
  return id;
};

const addPlayerToGame = (gameId, socket) => {
  const game: Game = gamesById[gameId];
  if(game.status != GAME_STATUS.IN_PROGRESS) { 
    const player: Player = {
      socketId: socket.id,
      nickName: `${getRandomName(7)}`,
      team: balanceTeams(gameId)     
    };
    socket.join(gameId);
    game.players.push(player);
    return true;
  }
  else {
    const dupGame = Object.assign({}, game);
    dupGame.status = GAME_STATUS.REJOIN;
    socket.join(gameId);
    socket.emit("NAV_MAIN_MENU", dupGame);
    return false;
  }
};

const startGame = (gameId: string) => {
  const game: Game = gamesById[gameId];
  game.status = GAME_STATUS.IN_PROGRESS;
  game.roundStatus = ROUND_STATUS.SCORE_BOARD;
  game.currentRound = ROUND_NUM.TABOO_ROUND;
};

const randomizeTeams = (socket) => {
  const game: Game = getGameBySocket(socket);
  const shuffledPlayers = shuffle(game.players)
  let i = 0
  for(i; i < Math.ceil(shuffledPlayers.length / 2); i++) {
    shuffledPlayers[i].team = TEAM.ONE;
  }
  for(i; i < shuffledPlayers.length; i++) {
    shuffledPlayers[i].team = TEAM.TWO;
  }
  game.players = shuffledPlayers;
}

const shuffle = (players: Player[]): Player[] => {
  let currentIndex = players.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = players[currentIndex];
    players[currentIndex] = players[randomIndex];
    players[randomIndex] = temporaryValue;
  }

  return players;
};

const shufflePhrases = (phrases: string[]): string[] => {
  let currentIndex = phrases.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = phrases[currentIndex];
    phrases[currentIndex] = phrases[randomIndex];
    phrases[randomIndex] = temporaryValue;
  }

  return phrases;
};

const balanceTeams = (gameId) => {
  const game: Game = gamesById[gameId];
  const numPlayers = game.players.length 
  if(numPlayers === 0) {
    return TEAM.ONE
  }

  const teamOne = game.players.filter(player => player.team === TEAM.ONE).length;
  const teamTwo = numPlayers - teamOne;
  return teamOne <= teamTwo ? TEAM.ONE : TEAM.TWO;
}
/* Init */

/* Player */
const getPlayerBySocket = socket => {
  const game = getGameBySocket(socket);
  return game.players.find(player => player.socketId === socket.id);
};

const updatePlayerName = (socket, nickName) => {
  const player: Player = getPlayerBySocket(socket);
  player.nickName = nickName;
};
/* Player */

/* Game */
const addPhrase = (socket, phrase) => {
  const game: Game = getGameBySocket(socket);
  game.phrases.push(phrase);
}

const nextRound = (currentRound: ROUND_NUM) =>{
  switch(currentRound) {
    case ROUND_NUM.TABOO_ROUND:
      return ROUND_NUM.CHARADE_ROUND;
    case ROUND_NUM.CHARADE_ROUND:
      return ROUND_NUM.PASSWORD_ROUND;
    case ROUND_NUM.PASSWORD_ROUND:
      return ROUND_NUM.END;
  }
}
/* Game */


// Async timeout
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

io.on("connection", socket => {

  socket.on("disconnect", function() {
     console.log("user disconnected: " + socket.id);
  });

  socket.on("disconnecting", function () {
    const gameId = getGameIdBySocket(socket);
    socket.leave(gameId);
    io.of('/').in(gameId).clients(function(error, clients) {
      if (clients.length == 0) {
        delete gamesById[gameId];
      }
    });
  });

  socket.on("disconnecting", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      const game = gamesById[gameId];
      const playersList = game.players
      const playerIndex = playersList.findIndex(player => player.socketId === socket.id)
      // Lobby Case
      if(game.status === GAME_STATUS.LOBBY) {
        playersList.splice(playerIndex, 1);
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
        return;
      }
    }
  });

  // Creates a new game with the player who made the game
  socket.on("NEW_GAME", () => {
    const gameId: string = createNewGame();
    addPlayerToGame(gameId, socket);
    io.to(gameId).emit("JOINED_GAME", getGameById(gameId));
    socket.emit("SET_SOCKET_ID", socket.id);

    console.log(`${socket.id} created a new game with gameId: ${gameId}`);
  });

  // Joins an existing game based on game id
  socket.on("JOIN_GAME", gameId => {
    const gameIds = Object.keys(gamesById);
    if (gameIds.includes(gameId)) {
      if(!addPlayerToGame(gameId, socket)){
        console.log(`${socket.id} rejoining a game with gameId: ${gameId}`)
        return;
      }

      io.to(gameId).emit("JOINED_GAME", getGameById(gameId));
      socket.emit("SET_SOCKET_ID", socket.id);

      console.log(`${socket.id} joined a game with gameId: ${gameId}`);
    } else {
      const game = {status: GAME_STATUS.NON_EXIST}
      socket.emit("NAV_MAIN_MENU", game);
      console.log(`Game Id ${gameId} does not exist.`);
    }
  });

  // Starts game 
  socket.on("START_GAME", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      startGame(gameId);
      io.to(gameId).emit("GAME_STARTING", getGameById(gameId));
    }
  });

  // Updates nickname in lobby
  socket.on("UPDATE_NICKNAME", (nickName: string) => {
    updatePlayerName(socket, nickName);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  // Adds phrase to game
  socket.on("ADD_PHRASE", (phrase: string) => {
    addPhrase(socket, phrase);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  // Switch team of player
  socket.on("SWITCH_TEAM", () => {
    const player: Player = getPlayerBySocket(socket)
    player.team = player.team === TEAM.ONE ? TEAM.TWO : TEAM.ONE;
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  // Randomize Teams
  socket.on("RANDOMIZE_TEAMS", () => {
    randomizeTeams(socket);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  // Update timer of game 
  socket.on("UPDATE_TIMER", (timer: number) => {
    const game: Game = getGameBySocket(socket);
    game.timer = timer;
    io.to(game.id).emit("UPDATE_GAME_STATE", getGameById(game.id));
  });

  // Start this round
  socket.on("START_ROUND", (currentRound: ROUND_NUM) => {
    const game: Game = getGameBySocket(socket)
    game.roundStatus = ROUND_STATUS.PLAYING;
    if(!game.rounds[game.currentRound].played[TEAM.ONE] && !game.rounds[game.currentRound].played[TEAM.TWO]) {
      game.phrases = shufflePhrases(game.phrases)
    }
    game.actioner = getPlayerBySocket(socket)
    io.to(game.id).emit("UPDATE_GAME_STATE", getGameById(game.id));
  });

  // Update timer of game 
  socket.on("TIME_UP", () => {
    const game: Game = getGameBySocket(socket);
    const player: Player = getPlayerBySocket(socket);
    game.rounds[game.currentRound].played[player.team] = true;
    io.to(game.id).emit("UPDATE_GAME_STATE", getGameById(game.id));
  });

  // Correct guess
  socket.on("CORRECT_GUESS", () => {
    const game: Game = getGameBySocket(socket)
    game.phraseIndex++;
    const player: Player = getPlayerBySocket(socket);
    game.rounds[game.currentRound].score[player.team]++;
    if(game.phraseIndex === game.phrases.length) {
      game.roundStatus = ROUND_STATUS.SCORE_BOARD
      game.rounds[game.currentRound].played[player.team] = true;
      game.currentRound = nextRound(game.currentRound);
      game.phraseIndex = 0;
    }
    io.to(game.id).emit("UPDATE_GAME_STATE", getGameById(game.id));
  });

  // Main menu button will send player back to main menu and remove that player from game
  socket.on("MAIN_MENU", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      const game = gamesById[gameId];
      const playersList = game.players
      const playerIndex = playersList.findIndex(player => player.socketId === socket.id)
      playersList.splice(playerIndex, 1);
      delete gamesById[gameId].players[socket.id];
      socket.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      socket.leave(gameId);
      socket.emit("NAV_MAIN_MENU", {});
      console.log(socket.id + " left the game with gameId: " + gameId)
     }
  });

  // Player rejoning game sets new socket id to all the right places
  socket.on("REJOIN_GAME", (nickName: string) => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      const playerList = gamesById[gameId].players
      const replacePlayer = playerList.find(player => player.nickName === nickName);
      replacePlayer.socketId = socket.id;
      socket.emit("SET_SOCKET_ID", socket.id);
      io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
    }
  });
});

console.log("listening on port", port);
