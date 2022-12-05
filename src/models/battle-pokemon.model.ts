import { Move } from "./move.model";

export interface BattlePokemon {
  pokedex: string;
  nick: string;
  level: number;
  health: { current: number; max: number; };
  attack: { base: number; level: number; };
  defense: { base: number; level: number; };
  power: { base: number; level: number; };
  resist: { base: number; level: number; };
  speed: { base: number; level: number; };
  accuracy: number;
  evasion: number;
  critical: number;
  status: object;
  move: Move;
  pps: number;
  charged: number;
}