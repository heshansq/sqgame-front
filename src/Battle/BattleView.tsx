import { BattleTeam } from "./battle-team.model";
import { GetBattleResult } from "./BattleFunctions";

export function BattleView(props: any) {
  const player: BattleTeam = props.player;
  const trainer: BattleTeam = props.trainer;
  const result: Array<{
    desc: string;
    data?: Array<any>;
  }> = GetBattleResult(player, trainer);

  console.log("BattleView", player, trainer, result);

  return <div>
    <div>
      { result.map((event, i) => <p key={"desc-" + i}>{ event.desc }</p>) }
    </div>
  </div>;
}
