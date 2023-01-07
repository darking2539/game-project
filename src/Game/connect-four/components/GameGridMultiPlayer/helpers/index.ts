import { RankingInfo, ClickAreaData } from '../../../../../utils/Interfaces';
import { Player } from '../../../../../utils/Types';


export function assignChipToLowestSlotPossibleIndex(index: number, clickAreas: ClickAreaData[], cols: number, rows: number) {
  let indexCounter = index;
  if (clickAreas[indexCounter]?.occupiedBy) {
    while (indexCounter >= 0 && clickAreas[indexCounter]?.occupiedBy) {
      indexCounter -= cols;
    }
  } else {
    while (indexCounter + cols < cols * rows && !clickAreas[indexCounter + cols]?.occupiedBy) {
      indexCounter += cols;
    }
  }
  return indexCounter;
}
