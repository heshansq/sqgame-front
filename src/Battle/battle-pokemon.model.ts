import { getMoves, MoveModel } from "../Database/Moves";
import { getEntryById } from "../Database/Pokedex";
import { Types } from "../models/enums/types.enum";
import { PokedexEntryModel } from "../models/pokedex-entry.model";
import { PokemonStatsModel } from "../models/pokemon-stats.model";
import { PokemonModel } from "../models/pokemon.model";

export interface BattlePokemon {
  name: string;
  level: number;
  types: Array<Types>;
  moves: Array<MoveModel>;
  usemove: MoveModel;
  health: { current: number; max: number; };
  attack: { base: number; change: number; };
  defense: { base: number; change: number; };
  power: { base: number; change: number; };
  resist: { base: number; change: number; };
  speed: { base: number; change: number; };
  accuracy: number;
  evasion: number;
  critical: number;
  weight: number;
  height: number;
  statuses: {
    burning: boolean;
    confused: number;
    flinching: boolean;
    frozen: boolean;
    leechSeed: boolean;
    paralyzed: boolean;
    sleeping: number;
    burnImmune?: boolean;
    confuseImmune?: boolean;
    freezeImmune?: boolean;
    leechSeedImmune?: boolean;
    paralyzeImmune?: boolean;
    sleepImmune?: boolean;
  };
}

function CalculateStats(pokemon: PokemonModel, entry: PokedexEntryModel): PokemonStatsModel {
  const level = pokemon.level;
  const ivs = pokemon.ivs;
  const evs = pokemon.evs;
  const nature = pokemon.nature;
  return {
    health: CalculateHealth(entry.baseStats.health, ivs.health, evs.health, level),
    attack: CalculateStat(entry.baseStats.attack, ivs.attack, evs.attack, level, nature.attack),
    defense: CalculateStat(entry.baseStats.defense, ivs.defense, evs.defense, level, nature.defense),
    power: CalculateStat(entry.baseStats.power, ivs.power, evs.power, level, nature.power),
    resist: CalculateStat(entry.baseStats.resist, ivs.resist, evs.resist, level, nature.resist),
    speed: CalculateStat(entry.baseStats.speed, ivs.speed, evs.speed, level, nature.speed)
  };
}
function CalculateHealth(base: number, iv: number, ev: number, level: number): number {
  return Math.floor(0.01 * (2 * base + iv + ev / 4) * level) + level + 10;
}
function CalculateStat(base: number, iv: number, ev: number, level: number, nature: number): number {
  return Math.floor(((0.01 * (2 * base + iv + ev / 4) * level) + 5) * nature);
}

export function MakeBattleReady(pokemon: PokemonModel): BattlePokemon {
  const entry: PokedexEntryModel = getEntryById(pokemon.pokedexID);
  const stats: PokemonStatsModel = CalculateStats(pokemon, entry);
  return {
    name: pokemon.nick,
    level: pokemon.level,
    types: entry.types,
    moves: getMoves(entry.moves),
    usemove: getMoves(entry.moves)[0],
    health: { current: stats.health, max: stats.health },
    attack: { base: stats.attack, change: 0 },
    defense: { base: stats.defense, change: 0 },
    power: { base: stats.power, change: 0 },
    resist: { base: stats.resist, change: 0 },
    speed: { base: stats.speed, change: 0 },
    accuracy: 0,
    evasion: 0,
    critical: 0,
    weight: entry.weight,
    height: entry.height,
    statuses: {
      burning: false,
      confused: 0,
      flinching: false,
      frozen: false,
      leechSeed: false,
      paralyzed: false,
      sleeping: 0,
    }
  };
}
