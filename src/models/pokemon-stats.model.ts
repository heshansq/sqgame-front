export interface PokemonStatsModel {
  health: number;
  attack: number;
  defense: number;
  power: number;
  resist: number;
  speed: number;
}
export function GetDefaultEVs(): PokemonStatsModel {
  return {
    health: 0,
    attack: 0,
    defense: 0,
    power: 0,
    resist: 0,
    speed: 0
  };
}
export function GetRandomIVs(): PokemonStatsModel {
  return {
    health: Math.floor(Math.random() * 32),
    attack: Math.floor(Math.random() * 32),
    defense: Math.floor(Math.random() * 32),
    power: Math.floor(Math.random() * 32),
    resist: Math.floor(Math.random() * 32),
    speed: Math.floor(Math.random() * 32)
  };
}