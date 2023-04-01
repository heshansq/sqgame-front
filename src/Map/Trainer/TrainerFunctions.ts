import { getEntryByName, Pokedex } from '../../Database/Pokedex';
import { MapTrainer } from "../../models/Map/map-trainer.model";

const rivalTeams: Array<Array<{
  pokemon: Array<string>;
  level: number;
}>> = [
  [{pokemon: ["Bulbasaur","Charmander","Squirtle"], level: 5}],
  [{pokemon: ["Pidgey"], level: 9}, {pokemon: ["Bulbasaur","Charmander","Squirtle"], level: 9}]
];
let rivalName: string = "Rival";
let rivalStarter: number = 0;// 0 = Bulbasaur, 1 = Charmander, 2 = Squirtle

function GetRival(index: number): MapTrainer {
  return {
    name: rivalName,
    team: rivalTeams[index].map(member => {
      return {
        pokemon: member.pokemon[member.pokemon.length > 1 ? rivalStarter : 0],
        level: member.level
      };
    })
  }
}

export function SetRival(name: string, starter: number) {
  rivalName = name;
  rivalStarter = starter;
}
export function ReadyMapTrainer(trainer: MapTrainer): MapTrainer {
  let readyTrainer = trainer.rival !== undefined ? GetRival(trainer.rival) : trainer;
  readyTrainer.team.forEach(member => {
    member.id = getEntryByName(member.pokemon).number;
  });
  return readyTrainer;
}