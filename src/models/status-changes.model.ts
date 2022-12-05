import { Targets } from "./enums/targets.enum"

export interface StatusChanges {
  target: Targets;
  burn?: number;
  freeze?: number;
  paralysis?: number;
  poison?: number;
  sleep?: number;
  confusion?: number;
  flinch?: number;
  leechSeed?: number;
  safeguard?: number;
  defensiveCurl?: number;
  fireSpin?: number;
  waterSport?: number;
  wrap?: number;
  sandstorm?: boolean;
  rain?: boolean;
  hail?: boolean;
}