import { Coords, ClickAreaData } from '../../../../../utils/Interfaces';

export function generateInitialRectDataArray(cols: number, rows: number) {
  const output: Coords[] = [];
  let indexCounter = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 88 * col + 8;
      const y = 88 * row + 8;
      output.push({ x, y, index: indexCounter });
      indexCounter++;
    }
  }
  return output;
}

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

export function isTieGame(clickAreas: ClickAreaData[], cols: number, rows: number) {
  const fullColumns = clickAreas.filter((clickArea) => {
    return clickArea.fullColumn;
  });
  return fullColumns.length === cols * rows;
}


export function verticalMatches(focusedClickArea: ClickAreaData, clickAreasData: ClickAreaData[], cols: number) {
  const selectedClickAreas: ClickAreaData[] = [];
  if (focusedClickArea.occupiedBy) {
    let currentSelectedClickArea: ClickAreaData = { ...focusedClickArea };
    while (currentSelectedClickArea && focusedClickArea.occupiedBy === currentSelectedClickArea.occupiedBy) {
      selectedClickAreas.push(currentSelectedClickArea);
      currentSelectedClickArea = clickAreasData[currentSelectedClickArea.index + cols];
    }
  }
  return selectedClickAreas;
}

export function horizonalMatches(focusedClickArea: ClickAreaData, clickAreasData: ClickAreaData[], checkedForAdditionMatch = false) {
  const selectedClickAreas: ClickAreaData[] = [];
  if (focusedClickArea.occupiedBy) {
    let currentSelectedClickArea: ClickAreaData = { ...focusedClickArea };
    while (currentSelectedClickArea && focusedClickArea.occupiedBy === currentSelectedClickArea.occupiedBy && focusedClickArea.y === currentSelectedClickArea.y) {
      selectedClickAreas.push(currentSelectedClickArea);
      currentSelectedClickArea = clickAreasData[currentSelectedClickArea.index - 1];
    }

    currentSelectedClickArea = clickAreasData[focusedClickArea.index + 1];
    while (currentSelectedClickArea && focusedClickArea.occupiedBy === currentSelectedClickArea.occupiedBy && focusedClickArea.y === currentSelectedClickArea.y) {
      selectedClickAreas.push(currentSelectedClickArea);
      currentSelectedClickArea = clickAreasData[currentSelectedClickArea.index + 1];
    }
  }

  if (checkedForAdditionMatch && selectedClickAreas.length === 3) {
    const firstArea = selectedClickAreas[0];
    const lastArea = selectedClickAreas[selectedClickAreas.length - 1];
    if (Math.abs(firstArea.index - lastArea.index) === 2) {
      let index = 0;
      if (firstArea.index > lastArea.index) {
        index = lastArea.index - 1;
      } else {
        index = lastArea.index + 1;
      }
      const newArea = clickAreasData.find((area) => area.index === index);
      if (newArea && !newArea.occupiedBy && newArea.y === firstArea.y) {
        selectedClickAreas.push(newArea);
      }
    }
  }

  return selectedClickAreas;
}

function checkDiagonalBoundariesAndGetClickArea(clickArea1: ClickAreaData, clickArea2: ClickAreaData) {
  if (clickArea1 && clickArea2 && clickArea1.y === clickArea2.y) {
    return clickArea2;
  } else {
    return { ...clickArea2, occupiedBy: undefined };
  }
}

export function diagonalLeftMatches(focusedClickArea: ClickAreaData, clickAreasData: ClickAreaData[], cols: number, checkedForAdditionMatch = false) {
  const selectedClickAreas: ClickAreaData[] = [];
  if (focusedClickArea.occupiedBy) {
    let currentSelectedClickArea: ClickAreaData = { ...focusedClickArea };
    while (currentSelectedClickArea && focusedClickArea.occupiedBy === currentSelectedClickArea.occupiedBy) {
      selectedClickAreas.push(currentSelectedClickArea);
      const clickArea1 = clickAreasData[currentSelectedClickArea.index - cols];
      const clickArea2 = clickAreasData[currentSelectedClickArea.index - cols - 1];
      currentSelectedClickArea = checkDiagonalBoundariesAndGetClickArea(clickArea1, clickArea2);
    }

    const clickArea1 = clickAreasData[focusedClickArea.index + cols];
    const clickArea2 = clickAreasData[focusedClickArea.index + cols + 1];
    currentSelectedClickArea = checkDiagonalBoundariesAndGetClickArea(clickArea1, clickArea2);
    while (currentSelectedClickArea && focusedClickArea.occupiedBy === currentSelectedClickArea.occupiedBy) {
      selectedClickAreas.push(currentSelectedClickArea);
      const clickArea1 = clickAreasData[currentSelectedClickArea.index + cols];
      const clickArea2 = clickAreasData[currentSelectedClickArea.index + cols + 1];
      currentSelectedClickArea = checkDiagonalBoundariesAndGetClickArea(clickArea1, clickArea2);
    }
  }
  return selectedClickAreas;
}

function removeDuplicates(duplicates: ClickAreaData[]) {
  const set = new Set<number>();
  const output: ClickAreaData[] = [];

  duplicates.forEach((clickArea) => {
    if (!set.has(clickArea.index)) {
      set.add(clickArea.index);
      output.push(clickArea);
    }
  });
  return output;
}

export function diagonalRightMatches(focusedClickArea: ClickAreaData, clickAreasData: ClickAreaData[], cols: number) {
  const selectedClickAreas: ClickAreaData[] = [];
  if (focusedClickArea.occupiedBy) {
    let currentSelectedClickArea: ClickAreaData = { ...focusedClickArea };
    while (currentSelectedClickArea && focusedClickArea.occupiedBy === currentSelectedClickArea.occupiedBy) {
      selectedClickAreas.push(currentSelectedClickArea);
      const clickArea1 = clickAreasData[currentSelectedClickArea.index + cols];
      const clickArea2 = clickAreasData[currentSelectedClickArea.index + cols - 1];
      currentSelectedClickArea = checkDiagonalBoundariesAndGetClickArea(clickArea1, clickArea2);
    }

    const clickArea1 = clickAreasData[focusedClickArea.index - cols];
    const clickArea2 = clickAreasData[focusedClickArea.index - cols + 1];
    currentSelectedClickArea = checkDiagonalBoundariesAndGetClickArea(clickArea1, clickArea2);
    while (currentSelectedClickArea && focusedClickArea.occupiedBy === currentSelectedClickArea.occupiedBy) {
      selectedClickAreas.push(currentSelectedClickArea);
      const clickArea1 = clickAreasData[currentSelectedClickArea.index - cols];
      const clickArea2 = clickAreasData[currentSelectedClickArea.index - cols + 1];
      currentSelectedClickArea = checkDiagonalBoundariesAndGetClickArea(clickArea1, clickArea2);
    }
  }
  return selectedClickAreas;
}

export function processForWinnersOrSwap(currentClickArea: ClickAreaData, clickAreasData: ClickAreaData[], cols: number, winningLength: number) {
  const matches: ClickAreaData[] = [];
  const vertMatches = verticalMatches(currentClickArea, clickAreasData, cols);
  const horizMatches = horizonalMatches(currentClickArea, clickAreasData);
  const diagLeftMatches = diagonalLeftMatches(currentClickArea, clickAreasData, cols);
  const diagRightMatches = diagonalRightMatches(currentClickArea, clickAreasData, cols);

  if (vertMatches.length >= winningLength) {
    matches.push(...vertMatches);
  }
  if (horizMatches.length >= winningLength) {
    matches.push(...horizMatches);
  }

  if (diagLeftMatches.length >= winningLength) {
    matches.push(...diagLeftMatches);
  }

  if (diagRightMatches.length >= winningLength) {
    matches.push(...diagRightMatches);
  }

  const finalMatches = removeDuplicates(matches);

  if (finalMatches.length >= winningLength) {
    const updatedClicks = clickAreasData.map((clickArea, i) => {
      const winnerClick: ClickAreaData | undefined = finalMatches.find((winningClick) => winningClick.index === i);
      if (winnerClick) {
        winnerClick.winningArea = true;
        return winnerClick;
      }
      return clickArea;
    });
    return updatedClicks;
  }

  return finalMatches;
}