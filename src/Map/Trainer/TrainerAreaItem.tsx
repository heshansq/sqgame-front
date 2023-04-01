import { MapTrainer } from '../../models/Map/map-trainer.model';
import { TrainerStatus } from './trainer-status.model';
import './TrainerAreaItem.scss';

export function TrainerAreaItem(props: any) {
  const data: MapTrainer = props.data;
  const status: TrainerStatus = props.status;

  function startBattle() {
    if (status !== TrainerStatus.Locked) {
      props.battle(data);
    }
  }
  
  return <section onClick={startBattle} className='trainer-area-item'>
    <h3>{status === TrainerStatus.Locked ? "???" : data.name}</h3>
    <div className='trainer-area-team'>
      {data.team.map((member, i) => <div key={data.name + "-member-" + i}>
        {status === TrainerStatus.Locked && <div className='trainer-pokemon'><span className='trainer-pokemon-unknown'>?</span><p>???</p></div>}
        {status === TrainerStatus.Next && <div className='trainer-pokemon'><img src={"/pokemon/sprites/" + member.id?.slice(1) + ".png"} alt={member.pokemon} /><p>???</p></div>}
        {status === TrainerStatus.Defeated && <div className='trainer-pokemon'><img src={"/pokemon/sprites/" + member.id?.slice(1) + ".png"} alt={member.pokemon} /><p>Lvl {member.level}</p></div>}
      </div>)}
      {[...Array(6 - data.team.length)].map((e, i) => <div key={"empty-box-" + i} className='trainer-pokemon'><span className='empty-slot'></span></div>)}
    </div>
  </section>;
}
