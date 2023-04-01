import { State } from "../models/state.model";
import './Tutorial.scss';
import { ChooseName } from "../Tutorial/ChooseName";
import { ChooseStarter } from "../Tutorial/ChooseStarter";

export function Tutorial(props: any) {
  const state: State = props.data;

  function save(data: State) {
    props.save(data);
  }

  return <section className="tutorial">
    { !state.name && <ChooseName save={(data: State) => save(data)} /> }
    { state.name && <ChooseStarter save={(data: State) => save(data)} name={state.name} rival={state.rival} /> }
  </section>;
}