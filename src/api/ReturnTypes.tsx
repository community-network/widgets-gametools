export type DetailedServerInfo = {
  cache?: boolean;
  country?: string;
  currentMap: string;
  currentMapImage: string;
  description?: string;
  favorites?: string;
  mode: string;
  official: boolean;
  platform: string;
  playerAmount: number;
  prefix: string;
  region: string;
  rotation?: ServerRotation[];
  settings?: ServerSettings[];
  smallmode: string;
  gameId?: string;

  blazeGameId?: number;
  teams?: TeamList;
  inQueue?: number;
  maxPlayerAmount?: number;
  platoon?: PlatoonResult;
  owner?: ServerOwnerResult;
  serverInfo?: ServerInfoResult;

  inQue?: number;
  maxPlayers?: number;
  noBotsPlayerAmount?: number;

  // older games
  mapImage?: string;
  map?: string;
  ip?: string;
  port?: number;
};

export type ServerOwnerResult = {
  id: string;
  name: string;
  avatar: string;
};

export type ServerInfoResult = {
  configDescription: string;
  configName: string;
  messages: string[];
  serverDescription: string;
  serverName: string;
};

export type TeamList = {
  teamOne: ServerTeams;
  teamTwo: ServerTeams;
};

export type ServerTeams = {
  image: string;
  key: string;
  name: string;
};

export type ServerRotation = {
  image: string;
  mapname: string;
  mode: string;
  index?: number;
};

export type Bf2042SettingValues = {
  assignValue: string;
  readableSettingName: string; // from translation
  settingName: string;
};

export type ServerSettings = {
  kits?: { [name: string]: string };
  Misc?: { [name: string]: string };
  Scales?: { [name: string]: string };
  Vehicles?: { [name: string]: string };
  Weapons?: { [name: string]: string };

  //#bf2042
  name?: string;
  settingsId?: number;
  values?: Bf2042SettingValues[];
};

export type PlatoonResult = {
  currentSize: number;
  emblem: string;
  id: string;
  name: string;
  description: string;
  tag: string;
};

export type seederPlayersReturn = {
  teams: seederTeamList[];
  serverinfo: serverInfoPlayerList;
};

export type serverInfoPlayerList = {
  country: string;
  description: string;
  level: string;
  maps: string[];
  mode: string;
  name: string;
  owner: string;
  region: string;
  servertype: string;
  settings: string[];
};

export type seederTeamList = {
  players: seederPlayer[];
  teamid: string;
  image: string;
  name: string;
  score: number;
  faction?: string;
  key?: string;
};

export type seederPlayer = {
  player_id: number;
  teamId: number;
  mark: number;
  rank: number;
  name: string;
  kills: number;
  deaths: number;
  score: number;
  vehicle: string;
  weapons: string[];
};

export type MainStats = {
  accuracy: string;
  avatar: string;
  avengerKills: number;
  awardScore: number;
  bestClass: string;
  bonusScore: number;
  cache: false;
  currentRankProgress: number;
  deaths: number;
  dogtagsTaken: number;
  headShots: number;
  headshots: string;
  heals: number;
  highestKillStreak: number;
  id: number;
  infantryKillDeath: number;
  infantryKillsPerMinute: number;
  killAssists: number;
  killDeath: number;
  kills: number;
  killsPerMinute: number;
  longestHeadShot: number;
  loses: number;
  activePlatoon: MainStatsPlatoon;
  platoons: MainStatsPlatoon[];
  sessions: MainStatsSession[];
  progress: MainStatsProgress[];
  gamemodes: MainStatsGamemode[];
  classes: MainStatsClasses[];
  rank: number;
  rankImg: string;
  repairs: number;
  revives: number;
  roundsPlayed: number;
  saviorKills: number;
  scorePerMinute: number;
  skill: number;
  squadScore: number;
  timePlayed: string;
  secondsPlayed?: number;
  totalRankProgress: number;
  userName: string;
  vehicles: MainStatsVehicle[];
  weapons: MainStatsWeapon[];
  winPercent: string;
  wins: number;
  quits: number;
  cashPerMinute?: number;
  hacker?: number;
  professional?: number;
  operator?: number;
  mechanic?: number;
  enforcer?: number;
  resupplies?: number;
};

export type MainStatsGamemode = {
  gamemodeName: string;
  score: number;

  wins?: number;
  losses?: number;
  winPercent?: string;
};

export type MainStatsClasses = {
  className: string;
  score: number;
  image: string;
  altImage: string;

  kills?: number;
  kpm?: number;

  timePlayed?: string;
  secondsPlayed?: number;

  serviceStarAmount?: number;
  serviceStarProgress?: string;
  serviceStarProgressAmount?: string;
};

export type MainStatsProgress = {
  progressName: string;
  current: number;
  total: number;
};

export type MainStatsSession = {
  playerId: number;
  serverId: string;
  serverName: string;
  stats: SessionStats;
  timeStamp: string;
};

export type SessionStats = {
  kills: number;
  deaths: number;
  wins: number;
  losses: number;
  timePlayed: number;
  gamemodes: SessionGamemode[];
  kits: SessionKit[];
};

export type SessionGamemode = {
  name: string;
  score: number;
  wins: number;
  losses: number;
};

export type SessionKit = {
  name: string;
  kills: number;
  score: number;
  timePlayed: number;
};

export type MainStatsPlatoon = {
  description: string;
  emblem: string;
  id: string;
  name: string;
  tag: string;
  type: string;
  url: string;
};

export type MainStatsVehicle = {
  destroyed: number;
  image: string;
  kills: number;
  killsPerMinute: number;
  type: string;
  vehicleName: string;
};

export type MainStatsWeapon = {
  accuracy: string;
  headshots: string;
  hitVKills: number;
  image: string;
  kills: number;
  killsPerMinute: number;
  type: string;
  weaponName: string;
};

export type OldGames = {
  name: string;
  players: any[];
  maxplayers: number;
  ping: number;
  connect: string;
};
