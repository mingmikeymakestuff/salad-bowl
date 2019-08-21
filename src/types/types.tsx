/* STATUS */
export enum GAME_STATUS {
  LOBBY = "LOBBY",
  IN_PROGRESS = "IN_PROGRESS",
  END = "END",
  REJOIN = "REJOIN",
  NON_EXIST = "NON_EXIST"
}

export enum ROUND_STATUS {
  SCORE_BOARD = "SCORE_BOARD", // Scoreboard, between switching teams, between rounds
  PLAYING = "PLAYING", // Playing
}

export enum ROUND_NUM {
  TABOO_ROUND = 0,
  CHARADE_ROUND = 1,
  PASSWORD_ROUND = 2,
  END = 3
}

/* Voting and Team */
export enum TEAM {
  ONE = 0,
  TWO = 1
}

/* Definitions */
export interface RootState {
  game: Game;
  user: User;
}

export interface User {
  socketId: string;
}

export interface Game {
  id: string;
  players: Player[];
  status?: GAME_STATUS;
  roundStatus: ROUND_STATUS;
  currentRound: ROUND_NUM;
  rounds: Round[];
  phrases: string[];
  phraseIndex: number;
  timer: number;
  timerCountdown: number;
  actioner: Player[];
}

export interface Round {
  id: ROUND_NUM;
  score: number[];
  played: boolean[]
}

export interface Player {
  socketId: string;
  nickName?: string;
  team: TEAM;
}
