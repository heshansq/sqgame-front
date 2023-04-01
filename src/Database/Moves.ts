import { Types } from "../models/enums/types.enum";

export interface MoveModel {
  id: string;
  name: string;
  desc: string;
  type: Types;
  category: MoveCategory;
  power?: number;
  accuracy?: number;
  contact?: boolean;
  priority?: number;
  target?: MoveTarget;
  recoil?: number;
  charge?: number;
  chargeDesc?: string;
  status?: Array<{
    target?: MoveTarget;
    leechSeed?: boolean;
  }>;
};
export enum MoveCategory {
  Status,
  Physical,
  Special
};
export enum MoveTarget {
  Enemies,
  Target,
  TargetFirst,
  TargetLast,
  TargetRandom,
  Allies,
  Self,
  SelfFirst,
  SelfLast,
  SelfRandom,
  All,
  Field
};

const Moves: Array<MoveModel> = [
  {
    id: "struggle",
    name: "Struggle",
    desc: "",
    type: Types.Typeless,
    category: MoveCategory.Physical,
    power: 50,
    contact: true,
    target: MoveTarget.Target,
    recoil: .25
  },
  {
    id: "leechSeed",
    name: "Leech Seed",
    desc: "",
    type: Types.Grass,
    category: MoveCategory.Status,
    accuracy: 90,
    status: [
      {
        target: MoveTarget.Target,
        leechSeed: true
      }
    ]
  },
  {
    id: "vineWhip",
    name: "Vine Whip",
    desc: "",
    type: Types.Grass,
    category: MoveCategory.Physical,
    power: 45,
    accuracy: 100,
    contact: true,
    target: MoveTarget.Target
  }
];

export function getMoves(ids: Array<string>): Array<MoveModel> {
  return ids.map(id => getMove(id));
}
function getMove(id: string): MoveModel {
  return Moves.find(move => move.id === id) || Moves[0];
}