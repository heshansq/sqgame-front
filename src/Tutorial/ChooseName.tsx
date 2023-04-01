import { useState } from "react";
import './Tutorial.scss';

export function ChooseName(props: any) {
  const [name, setName] = useState("Green");
  const [rival, setRival] = useState("Red");

  function save() {
    props.save({
      name: name,
      rival: rival
    });
  }

  return <article>
    <img src="/images/oak.png" alt="Professor Oak" className="speaker" />
    <h1>Hello there!</h1>
    <p>Glad to meet you! Welcome to the world of pokémon! My name is Oak. People affectionately refer to me as the pokémon professor. This world is inhabited far and wide by creatures called pokémon. For some people, pokémon are pets. Others use them for battling. As for my self... I study pokémon as a profession.</p>
    <form>
      <label htmlFor="name">But first, tell be a little about yourself. Let's begin with your name. What is it?</label>
      <input id="name" type="text" maxLength={10} value={name} onChange={(evt) => { setName(evt.target.value); }} />
      <label htmlFor="rival">This is my grandson. He's been your rival since you both were babies. Erm... What was his name now?</label>
      <input id="rival" type="text" maxLength={10} value={rival} onChange={(evt) => { setRival(evt.target.value); }} />
      <button onClick={save}>Done</button>
    </form>
  </article>;
}