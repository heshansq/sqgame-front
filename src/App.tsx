import { useState } from 'react';
import './App.scss';
import { MapData } from './Database/MapData';
import { Engine } from './Engine/Engine';
import { SetRival } from './Map/Trainer/TrainerFunctions';
import { MapAreaProgressModel } from './models/Map/map-area-progress.model';
import { PokemonModel } from './models/pokemon.model';
import { State } from './models/state.model';

function getStoredString(key: string, def: string): string {
  return localStorage.getItem(key) || def;
}
function getStoredNumber(key: string, def: number): number {
  const storage = localStorage.getItem(key);
  return storage !== null ? parseInt(storage) : def;
}
function getStoredArray(key: string, def: Array<any>): Array<any> {
  const storage = localStorage.getItem(key);
  return storage ? JSON.parse(storage) : def;
}
function loadProgress(): Array<MapAreaProgressModel> {
  let progress: Array<MapAreaProgressModel> = getStoredArray("progress", []);
  MapData.forEach(area => {
    if (!progress.find(data => data.id === area.id)) {
      progress.push({
        id: area.id,
        trainersDefeated: 0,
        wildernessDefeated: false,
        completed: false
      });
    }
  });
  return progress;
}

function App() {
  const [name, setName] = useState(getStoredString("name", ""));
  const [rival, setRival] = useState(getStoredString("rival", ""));
  const [starter, setStarter] = useState(getStoredNumber("starter", -1));
  const [team, setTeam] = useState(getStoredArray("team", []) as Array<number>);
  const [box, setBox] = useState(getStoredArray("box", []) as Array<PokemonModel>);
  const [pokedex, setPokedex] = useState(getStoredArray("pokedex", []) as Array<number>);
  const [progress, setProgress] = useState(loadProgress());

  if (rival !== "" && starter >= 0) {
    SetRival(rival, (starter + 1) % 3);
  }

  function Save(data: State) {
    if (data.name)
      localStorage.setItem("name", data.name);
    if (data.rival)
      localStorage.setItem("rival", data.rival);
    if (data.starter !== undefined)
      localStorage.setItem("starter", data.starter.toString());
    if (data.team)
      localStorage.setItem("team", JSON.stringify(data.team));
    if (data.box)
      localStorage.setItem("box", JSON.stringify(data.box));
    if (data.pokedex)
      localStorage.setItem("pokedex", JSON.stringify(data.pokedex));
    if (data.progress)
      localStorage.setItem("progress", JSON.stringify(data.progress));
  }

  function UpdateState(data: State) {
    if (data.name)
      setName(data.name);
    if (data.rival)
      setRival(data.rival);
    if (data.starter)
      setStarter(data.starter);
    if (data.team)
      setTeam(data.team);
    if (data.box)
      setBox(data.box);
    if (data.pokedex)
      setPokedex(data.pokedex);
    if (data.progress)
      setProgress(data.progress);
    Save(data);
  }

  return (
    <div className="App">
      <Engine
        name={name}
        rival={rival}
        starter={starter}
        team={team}
        box={box}
        pokedex={pokedex}
        progress={progress}
        save={ (data: State) => UpdateState(data)
      } />
    </div>
  );
}

export default App;
