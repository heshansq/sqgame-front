import { useMemo } from "react";
import { GetSeedString, rand, SetSeed } from "../Common/RandomFunctions";
import { GetRandomPokemon, PokemonModel } from "../models/pokemon.model";
import { BattlePokemon, MakeBattleReady } from "./battle-pokemon.model";
import { BattleTeam } from "./battle-team.model";

interface BattleResult {
  desc: string;
  data?: Array<any>;
}

export function MakePlayerReady(team: Array<PokemonModel>): Array<BattlePokemon> {
  return team.map(member => MakeBattleReady(member));
}
export function MakeTrainerReady(team: Array<{ pokemon: string, level: number }>): Array<BattlePokemon> {
  return team.map(member => MakeBattleReady(GetRandomPokemon(member.pokemon, member.level)));
}

export function GetBattleResult(a: BattleTeam, b: BattleTeam): Array<BattleResult> {
  SetSeed(GetSeedString());
  let result: Array<BattleResult> = [];
  let round: number = 0;
  let field: any = {};
  while (++round <= 50 && a.team.length > 0 && b.team.length > 0) {
    result = result.concat(PlayRound(a.team, b.team, field));
  }
  if (a.team.length > b.team.length)
    return result.concat([{ desc: a.name + " won!" }]);
  if (b.team.length > a.team.length)
    return result.concat([{ desc: b.name + " won!" }]);
  return result.concat([{ desc: "It'a a draw!" }]);
}
function PlayRound(a: Array<BattlePokemon>, b: Array<BattlePokemon>, field: any): Array<BattleResult> {
  let result: Array<BattleResult> = [];
  DecideMove(a[0]);
  DecideMove(b[0]);
  if (GetFaster(a[0], b[0])) {
    result.concat(TakeTurn(a, b, field));
    result.concat(TakeTurn(b, a, field));
    result.concat(EndOfRound(a, b, field));
  }
  else {
    result.concat(TakeTurn(b, a, field));
    result.concat(TakeTurn(a, b, field));
    result.concat(EndOfRound(b, a, field));
  }
  return field.concat(result);
}
function DecideMove(pokemon: BattlePokemon) {
  //[TODO]
  pokemon.usemove = pokemon.moves[0];
}
function GetFaster(a: BattlePokemon, b: BattlePokemon): boolean {
  if ((a.usemove.priority || 0) !== (b.usemove.priority || 0))
    return (a.usemove.priority || 0) >= (b.usemove.priority || 0);
  return GetModifiedSpeed(a) >= GetModifiedSpeed(b);
}
function GetModifiedSpeed(pokemon: BattlePokemon): number {
  let speed = GetModifiedStat(pokemon.speed.base, pokemon.speed.change);
  if (pokemon.statuses.paralyzed)
    speed *= .5;
  return speed;
}
function GetModifiedStat(stat: number, change: number): number {
  const base = 2;/* (-6 -> +6) (2: 25% -> 400%) (3: 33% -> 300%) (6: 50% -> 200%) (12: 67% -> 150%) */
  change = Clamp(change, -6, 6);
  return stat * (base + (change > 0 ? change : 0)) / (base + (change < 0 ? Math.abs(change) : 0));
}
function Clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
function TakeTurn(attacker: Array<BattlePokemon>, defender: Array<BattlePokemon>, field: any): Array<BattleResult> {
  if (attacker[0].health.current <= 0)
    return [];
  let check = CheckImmobilized(attacker[0], field);
  if (check.immobile)
    return check.result;
  return check.result.concat(UseMove(attacker, defender, field));
}
function CheckImmobilized(attacker: BattlePokemon, field: any): { immobile: boolean; result: Array<BattleResult>; } {
  let result: Array<BattleResult> = [];
  if (attacker.statuses.sleeping && attacker.statuses.sleeping > 0) {
    attacker.statuses.sleeping -= 1;
    if (attacker.statuses.sleeping > 0)
      return { immobile: true, result: [{ desc: attacker.name + " is fast asleep..." }] };
    else
      result.push({ desc: attacker.name + " woke up!" });
  }
  if (attacker.statuses.frozen) {
    if (rand() < .2) {
      result.push({ desc: attacker.name + " is no longer frozen!" });
      attacker.statuses.frozen = false;
    }
    else
      return { immobile: true, result: result.concat([{ desc: attacker.name + " is frozen and can't move..." }]) };
  }
  if (attacker.statuses.flinching) {
    return { immobile: true, result: result.concat([{ desc: attacker.name + " flinched..." }]) };
  }
  if (attacker.statuses.paralyzed) {
    if (rand() < .25)
      return { immobile: true, result: result.concat([{ desc: attacker.name + " is paralyzed, they can't move..." }]) };
    result.push({ desc: attacker.name + " is still paralyzed." });
  }
  if (attacker.statuses.confused && attacker.statuses.confused > 0) {
    attacker.statuses.confused -= 1;
    if (attacker.statuses.confused > 0) {
      if (rand() < .5) {
        let damage = Clamp(GetConfuseDamage(attacker), 0, attacker.health.max - attacker.health.current);
        result = result.concat(DealDamage(attacker, damage));
        return { immobile: true, result: result.concat([
          { desc: attacker.name + " hurt themselves in confusion..." },
          { desc: attacker.name + " takes " + damage + " damage." }
        ]) };
      }
      result.push({ desc: attacker.name + " is still confused." });
    }
    else
      result.push({ desc: attacker.name + " snapped out of their confusion!" });
  }
  return { immobile: false, result: result };
}
function GetConfuseDamage(pokemon: BattlePokemon): number {
  let attack = GetModifiedStat(pokemon.attack.base, pokemon.attack.change);
  let defense = GetModifiedStat(pokemon.defense.base, pokemon.defense.change);
  let damage: number = (2 * pokemon.level / 5 + 2) * 40 * attack / defense / 50;
  damage *= GetBurningMultiplier(pokemon);
  return Math.round(damage + 2);
}
function GetBurningMultiplier(attacker: BattlePokemon): number {
  return attacker.statuses.burning ? .5 : 1;
}
function DealDamage(pokemon: BattlePokemon, damage: number): Array<BattleResult> {
  if (pokemon.health.current <= 0)
    return [];
  pokemon.health.current -= damage;
  if (pokemon.health.current <= 0)
    return [{ desc: pokemon.name + " was knocked unconscious." }];
  return [];
}
function UseMove(attackers: Array<BattlePokemon>, defenders: Array<BattlePokemon>, field: any): Array<BattleResult> {
  let result: Array<BattleResult> = [];
  let attacker = attackers[0], defender = defenders[0];
  if (attacker.health.current <= 0)
    return [];
  if (CheckCharging(attacker, field))
    return [{ desc: attacker.name + (attacker.usemove.chargeDesc || " is charging.") }];
  result.push({ desc: attacker.name + " uses " + attacker.usemove.name + "." });
  if (attacker.effects.retaliation)
    attacker.effects.retaliation = 0;
  if (DidHit(attacker, defender)) {
    let attacks = attacker.move.attacks ? attacker.move.attacks.length : 1;
    for (let i = 0; i < attacks; i++) {
      if (attacker.move.attacks && rand() > attacker.move.attacks[i])
        return;
      if (attacker.move.category !== MoveCategories.Status && defender.health.current > 0) {
        if (attacker.move.category === MoveCategories.Physical)
          attacker.effects.retaliation = attacker.move.power;
        let damage = GetDamage(attacker, defender, battlefield);
        if (damage > 0) {
          attacker.effects.didDealDamage = true;
          DisplayMessage("It deals " + damage + " damage.");
          DealDamage(defender, damage);
          if (attacker.move.drain) {
            let heal = Clamp(Math.round(damage * attacker.move.drain), 0, attacker.health.max - attacker.health.current);
            if (heal > 0) {
              attacker.health.current += heal;
              DisplayMessage(attacker.nick + " absorbs " + heal + " health!");
            }
          }
          if (attacker.move.recoil) {
            let recoil = Clamp(Math.round(damage * attacker.move.recoil), 0, attacker.health.max - attacker.health.current);
            if (recoil > 0) {
              DisplayMessage(attacker.nick + " takes " + recoil + " recoil damage...");
              DealDamage(attacker, recoil);
            }
          }
        }
        else
          DisplayMessage("It deals no damage...");
      }
      ApplyMoveEffects(attackers, defenders, battlefield);
    }
  }
  else {
    DisplayMessage("It missed!");
    if (attacker.effects.rolledout)
      attacker.effects.rolledout = 0;
  }
}
