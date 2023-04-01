import { useState } from "react";
import './Tutorial.scss';
import { GetRandomPokemon } from "../models/pokemon.model";
import { PokemonCard } from "../Pokemon/Card/PokemonCard";

export function ChooseStarter(props: any) {
  const [index, setIndex] = useState(-1);
  const [starters] = useState([
    GetRandomPokemon("Bulbasaur", 5),
    GetRandomPokemon("Charmander", 5),
    GetRandomPokemon("Squirtle", 5)
  ]);

  function save() {
    let pokedex: Array<number> = new Array(151);
    pokedex.fill(0);
    pokedex[index * 3] = 2;
    props.save({
      starter: index,
      team: [0],
      box: [starters[index]],
      pokedex: pokedex
    });
  }

  return <article>
    <h1>That's right!</h1>
    <p>I remember now! His name is { props.rival }!</p>
    <p>{ props.name }! Your very own pokémon legend is about to unfold! A world of dreams and adventure with pokémon awaits! Come with me!</p>
    <p>There are three pokémon here. The pokémon are held inside these poké balls. When I was young, I was a serious pokémon trainer. But now, in my old age, I have only these three left. You can have one. Go on, choose!</p>
    <form>
      <section className="starters">
        { starters.map((pokemon, i) => <PokemonCard pokemon={pokemon} select={() => setIndex(i)} key={"pokemon-card-" + i} />) }
      </section>
      { index >= 0 && <button onClick={save}>Pick { starters[index].nick }</button> }
    </form>
  </article>;
}