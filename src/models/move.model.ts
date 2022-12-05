import { Types } from "./enums/types.enum";
import { MoveCategories } from "./enums/move-categories.enum";
import { StatChanges } from "./stat-changes.model";
import { StatusChanges } from "./status-changes.model";
import { Invulnerabilities } from "./enums/invulnerabilities.enum";

export interface Move {
  name: string;
  desc: string;
  type: Types;
  category: MoveCategories;
  power?: number;
  causeKo?: boolean;
  levelDamage?: boolean;
  retaliate?: number;
  accuracy?: number;
  accuracyLevelDifference?: boolean;
  pp: number;
  priority?: number;
  contact: boolean;
  attacks?: Array<number>;
  charge?: number;
  critBonus?: number;
  drain?: number;
  recoil?: number;
  swap?: boolean;
  statChanges?: StatChanges;
  statusChanges?:StatusChanges;
  invulnerable?: Invulnerabilities;
}