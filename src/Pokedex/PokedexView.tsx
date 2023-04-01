import './PokedexView.scss';
import { Pokedex } from "../Database/Pokedex";
import { Types } from "../models/enums/types.enum";
import { useState } from 'react';

export function PokedexView(props: any) {
  const [pokedex, setPokedex] = useState(Pokedex);

  function UpdatePokedex() {}

  return <div className="pokedex">
    { pokedex.map((entry, i) =>
      <div className="entry" key={"pokedex-" + i}>
        <h3>{entry.number} {entry.name}</h3>
        <img src={"/pokemon/hires/" + entry.number.slice(1) + ".png"} alt={entry.name} />
        <input id={entry.number + "-species"} type="text" value={entry.species} onChange={UpdatePokedex} />
        <div className="types">{entry.types.map((type, i) => <input id={entry.number + "-types-" + i} type="text" value={Types[type]} key={entry.number + "-types-" + i} onChange={UpdatePokedex} />)}</div>
      </div>)
    }
  </div>;
}