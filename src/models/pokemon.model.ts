import { getEntryByName } from "../Database/Pokedex";
import { PokedexEntryModel } from "./pokedex-entry.model";
import { GetRandomNature, PokemonNatureModel } from "./pokemon-nature.model";
import { GetDefaultEVs, GetRandomIVs, PokemonStatsModel } from "./pokemon-stats.model";

export interface PokemonModel {
  nick: string;
  pokedexID: number;
  nature: PokemonNatureModel;
  ivs: PokemonStatsModel;
  evs: PokemonStatsModel;
  level: number;
  experience: number;
}
export function GetRandomPokemon(name: string, level: number): PokemonModel {
  const pokedexEntry: PokedexEntryModel = getEntryByName(name);
  
  return {
    nick: name,
    pokedexID: pokedexEntry.id,
    nature: GetRandomNature(),
    ivs: GetRandomIVs(),
    evs: GetDefaultEVs(),
    level: level,
    experience: 0
  }
}