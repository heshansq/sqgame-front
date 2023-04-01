import { MapAreaProgressModel } from "./Map/map-area-progress.model";
import { PokemonModel } from "./pokemon.model";

export interface State {
  name?: string;
  rival?: string;
  starter?: number;
  team?: Array<number>;
  box?: Array<PokemonModel>;
  pokedex?: Array<number>;
  progress?: Array<MapAreaProgressModel>;
}