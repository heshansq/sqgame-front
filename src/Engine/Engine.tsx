import { MapView } from "../Map/MapView";
import { State } from "../models/state.model";
import './Engine.scss';
import { Tutorial } from "../Tutorial/Tutorial";
import { useState } from "react";
import { Views } from "./views.model";
import { MapTrainer } from "../models/Map/map-trainer.model";
import { BattleView } from "../Battle/BattleView";
import { BattleTeam } from "../Battle/battle-team.model";
import { PokemonModel } from "../models/pokemon.model";
import { MakePlayerReady, MakeTrainerReady } from "../Battle/BattleFunctions";

export function Engine(props: any) {
  const state: State = {
    name: props.name,
    rival: props.rival,
    starter: props.starter,
    team: props.team,
    box: props.box,
    pokedex: props.pokedex,
    progress: props.progress
  }
  const [view, setView] = useState(showTutorial() ? Views.Tutorial : Views.Map);
  const [trainer, setTrainer] = useState({} as MapTrainer);

  function showTutorial(): boolean {
    return !state.name || state.starter === undefined || state.starter < 0;
  }
  function save(data: State) {
    props.save(data);
  }
  function startBattle(data: MapTrainer) {
    setTrainer(data);
    setView(Views.Battle);
  }
  function getTeam(): Array<PokemonModel> {
    return state.team?.map(index => state.box ? state.box[index] : undefined) as Array<PokemonModel> || [] as Array<PokemonModel>;
  }
  function getPlayer(): BattleTeam {
    return {
      name: state.name,
      team: MakePlayerReady(getTeam())
    } as BattleTeam;
  }
  function getTrainer(): BattleTeam {
    return {
      name: trainer.name,
      team: MakeTrainerReady(trainer.team)
    } as BattleTeam;
  }
  function battleOver(data: any) {
    console.log(data);
  }

  return <article className="game">
    { view === Views.Tutorial && <Tutorial data={state} save={(data: State) => save(data)} /> }
    { view === Views.Map && <MapView progress={state.progress} battle={(data: MapTrainer) => startBattle(data)} /> }
    { view === Views.Battle && <BattleView player={getPlayer()} trainer={getTrainer()} finished={(data: any) => battleOver(data)} /> }
  </article>;
}
