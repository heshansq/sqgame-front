import { Types } from "./enums/types.enum";
import { PokedexEvolutionModel } from "./pokedex-evolution.model";
import { PokemonStatsModel } from "./pokemon-stats.model";

export interface PokedexEntryModel {
  id: number;
  number: string;
  name: string;
  desc: string;
  types: Array<Types>;
  species: string;
  stage: number;
  evolutions?: Array<PokedexEvolutionModel>;
  height: number;
  weight: number;
  evYield: {
    health?: number;
    attack?: number;
    defense?: number;
    power?: number;
    resist?: number;
    speed?: number;
  };
  catchRate: number;
  expYield: number;
  growthRate: number;
  baseStats: PokemonStatsModel;
  moves: Array<string>;
  abilities: Array<string>;
}