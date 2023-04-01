import { BattlePokemon } from "./battle-pokemon.model";

export interface BattleTeam {
  name: string;
  team: Array<BattlePokemon>;
}