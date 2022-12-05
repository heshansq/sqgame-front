import { Types } from "./enums/types.enum";
import { StatsObject } from "./stats-object.model";
import { Move } from "./move.model";

export interface PokedexEntry {
  id: string;
  name: string;
  desc: string;
  species: string;
  stage: number;
  evolutions: object;
  types: Array<Types>;
  evYield: StatsObject;
  expYield: number;
  baseStats: StatsObject;
  move: Move;
}