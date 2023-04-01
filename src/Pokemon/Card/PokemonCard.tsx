import { getEntryById, Pokedex } from '../../Database/Pokedex';
import { Types } from '../../models/enums/types.enum';
import { PokedexEntryModel } from '../../models/pokedex-entry.model';
import { PokemonNatureModel } from '../../models/pokemon-nature.model';
import { PokemonModel } from '../../models/pokemon.model';
import './PokemonCard.scss';

export function PokemonCard(props: any) {
  const pokemon: PokemonModel = props.pokemon;
  const pokedexEntry: PokedexEntryModel = getEntryById(pokemon.pokedexID);

  const classes = () => "pokemon-card " + Types[pokedexEntry.types[0]].toLowerCase() + (props.select ? " pickable" : "");

  function getNatureStrings(nature: PokemonNatureModel): Array<string> {
    let natureStrings: Array<string> = [];
    if (nature.attack !== 1)
      natureStrings[nature.attack > 1 ? 0 : 1] = "Attack";
    if (nature.defense !== 1)
      natureStrings[nature.defense > 1 ? 0 : 1] = "Defense";
    if (nature.power !== 1)
      natureStrings[nature.power > 1 ? 0 : 1] = "Power";
    if (nature.resist !== 1)
      natureStrings[nature.resist > 1 ? 0 : 1] = "Resist";
    if (nature.speed !== 1)
      natureStrings[nature.speed > 1 ? 0 : 1] = "Speed";
    return natureStrings;
  }
  function natureBlock() {
    const nature: Array<string> = getNatureStrings(pokemon.nature);
    return <section className='pokemon-card_nature'>
      { nature.length > 0 && <p className='pokemon-card_nature-positive'>+ { nature[0] }</p> }
      { nature.length > 0 && <p className='pokemon-card_nature-negative'>- { nature[1] }</p> }
      { nature.length === 0 && <p className='pokemon-card_nature-neutral'>Neutral</p> }
    </section>;
  }
  function individualBlock() {
    return <section className='pokemon-card_individual'>
      <h4>Individual Values</h4>
      <div className='pokemon-card_individual-content'>
        <div className='pokemon-card_individual-column'>
          <div className='pokemon-card_individual-value'><p>Health</p><p><b>{ pokemon.ivs.health }</b></p></div>
          <div className='pokemon-card_individual-value'><p>Attack</p><p><b>{ pokemon.ivs.attack }</b></p></div>
          <div className='pokemon-card_individual-value'><p>Defense</p><p><b>{ pokemon.ivs.defense }</b></p></div>
        </div>
        <div className='pokemon-card_individual-column'>
          <div className='pokemon-card_individual-value'><p>Power</p><p><b>{ pokemon.ivs.power }</b></p></div>
          <div className='pokemon-card_individual-value'><p>Resist</p><p><b>{ pokemon.ivs.resist }</b></p></div>
          <div className='pokemon-card_individual-value'><p>Speed</p><p><b>{ pokemon.ivs.speed }</b></p></div>
        </div>
      </div>
    </section>;
  }

  return <section className={ classes() } onClick={props.select}>
    <h2 className='pokemon-card_header'>{ pokemon.nick }</h2>
    <div className='pokemon-card_thumbnail'>
      <img src={ '/pokemon/hires/' + pokedexEntry.number.slice(1) + '.png' } alt={ pokemon.nick } />
    </div>
    <h3 className='pokemon-card_level'>Level { pokemon.level }</h3>
    { natureBlock() }
    { individualBlock() }
  </section>;
}
