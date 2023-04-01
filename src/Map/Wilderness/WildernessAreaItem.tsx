import { MapAreaWildernessPokemonModel } from '../../models/Map/map-area-wilderness-pokemon.model';
import './WildernessAreaItem.scss';

export function WildernessAreaItem(props: any) {
  const data: Array<MapAreaWildernessPokemonModel> = props.data;
  const catchable: boolean = props.catchable;

  return <section className='wilderness-area-item'>
    <img className='icon' src={ "map/wilderness.png" } alt='Battle Wild Pokemon' />
    { data.map(pokemon => <section key={pokemon.pokemon}>
      <img alt={pokemon.pokemon} />
      <p>{ pokemon.pokemon }</p>
      <p>Lvl. { pokemon.level.join("-") }</p>
      <p>{ Math.round(pokemon.chance * 1000) / 10 }%</p>
    </section>).join("") }
    <section className='buttons'>
      <button>Battle</button>
      { catchable && <button>Catch</button> }
    </section>
  </section>;
}