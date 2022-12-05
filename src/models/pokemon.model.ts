import { Stats } from "./enums/stats.enum";

export interface Pokemon {
  id: number;
  pokedex: string;
  nick: string;
  nature: Stats;
  ivs: Stats;
  evs: Stats;
  level: number;
  experience: number;
}