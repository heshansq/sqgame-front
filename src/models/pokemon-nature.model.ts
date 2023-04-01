export interface PokemonNatureModel {
  attack: number;
  defense: number;
  power: number;
  resist: number;
  speed: number;
}
export function GetRandomNature(): PokemonNatureModel {
  const effectiveness = 5;
  let stats = [effectiveness, effectiveness, effectiveness, effectiveness, effectiveness];
  stats[Math.floor(Math.random() * stats.length)] += 1;
  stats[Math.floor(Math.random() * stats.length)] -= 1;
  return {
    attack: stats[0] / effectiveness,
    defense: stats[1] / effectiveness,
    power: stats[2] / effectiveness,
    resist: stats[3] / effectiveness,
    speed: stats[4] / effectiveness
  };
}