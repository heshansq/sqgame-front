import { MapData } from '../Database/MapData';
import { MapAreaProgressModel } from '../models/Map/map-area-progress.model';
import { MapTrainer } from '../models/Map/map-trainer.model';
import { AreaView } from './Area/AreaView';
import './MapView.scss';

export function MapView(props: any) {
  const progress: Array<MapAreaProgressModel> = props.progress;

  const unlockedAreas: Array<any> = MapData.filter(area => {
    return !area.require || area.require.filter(requirement => !progress.find(data => data.id === requirement)?.completed).length === 0;
  });

  function startBattle(data: MapTrainer) {
    props.battle(data);
  }

  return <article className='map'>
    { unlockedAreas.map(area =>
      <AreaView
        key={area.id}
        area={area}
        progress={progress.find(data => data.id === area.id)}
        battle={(data: MapTrainer) => startBattle(data)}
      />
    ) }
  </article>;
}
