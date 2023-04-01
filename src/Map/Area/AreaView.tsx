import { MapAreaProgressModel } from '../../models/Map/map-area-progress.model';
import { MapAreaModel } from '../../models/Map/map-area.model';
import { MapTrainer } from '../../models/Map/map-trainer.model';
import { TrainerStatus } from '../Trainer/trainer-status.model';
import { TrainerAreaItem } from '../Trainer/TrainerAreaItem';
import { ReadyMapTrainer } from '../Trainer/TrainerFunctions';
import './AreaView.scss';

export function AreaView(props: any) {
  const area: MapAreaModel = props.area;
  const progress: MapAreaProgressModel = props.progress;

  function startBattle(data: MapTrainer) {
    props.battle(data);
  }

  return <section className='area'>
    <div className='area-header'>
      <h2>{ area.name }</h2>
    </div>
    {area.trainers && <div className='area-trainers'>
      <div className='area-trainers-header'>
        <h3>Trainers</h3>
      </div>
      {area.trainers.map((trainer, i) =>
        <TrainerAreaItem
          key={area.id + "-trainer-" + i}
          data={ReadyMapTrainer(trainer)}
          status={progress.trainersDefeated > i ? TrainerStatus.Defeated : (progress.trainersDefeated === i ? TrainerStatus.Next : TrainerStatus.Locked)}
          battle={(data: MapTrainer) => startBattle(data)}
        />
      )}
    </div>}
  </section>;
}
