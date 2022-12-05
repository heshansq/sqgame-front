import { Targets } from "./enums/targets.enum"

export interface StatChanges {
  target: Targets;
  attack?: number;
  defense?: number;
  power?: number;
  resist?: number;
  speed?: number;
  accuracy?: number;
  evasion?: number;
  critical?: number;
  chance: number;
}