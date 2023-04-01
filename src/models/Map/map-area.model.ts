import { MapTrainer } from "./map-trainer.model";
import { MapAreaWildernessPokemonModel } from "./map-area-wilderness-pokemon.model";

export interface MapAreaModel {
  id: string;
  name: string;
  require?: Array<string>;
  wilderness?: Array<MapAreaWildernessPokemonModel>;
  trainers?: Array<MapTrainer>;
}