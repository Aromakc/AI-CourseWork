import React, { useEffect } from 'react';
import PuzzleBox from './component/PuzzleBox';
import { useState, useRef } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

const EightPuzzle = () => {
  const myRef = useRef(null);

  const goalState = [
    [8, 0, 3],
    [2, 6, 4],
    [1, 7, 5],
  ];
  const initialState = {
    data: [
      [2, 8, 3],
      [1, 6, 4],
      [7, 0, 5],
    ],
    isRecursive: false,
    isGoal: false,
    currentLevel: 0,
    id: '1',
    parentId: '',
    action: '',
  };
  let nodeCount = 1;

  const [currentLevel, setCurrentLevel] = useState(0);
  const [stateArray, setStateArray] = useState([[initialState]]);
  const [isGoalState, setIsGoalState] = useState(false);

  //solving using BFS which performs transition such as u, l, d, r

  const findZero = (data) => {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.length; j++) {
        const col = row[j];
        if (col === 0) {
          return { i, j };
        }
      }
    }
  };

  const checkRecursive = (newData, currentArray) => {
    // check if new data is in previous state
    for (const state of stateArray) {
      for (const item of state) {
        if (JSON.stringify(item.data) === JSON.stringify(newData)) {
          return true;
        }
      }
    }

    // check if new data is in current state
    for (const item of currentArray) {
      if (JSON.stringify(item.data) === JSON.stringify(newData)) {
        return true;
      }
    }

    return false;
  };

  const checkGoalState = (data) => {
    return JSON.stringify(data) === JSON.stringify(goalState);
  };

  const performStateSpaceSearch = () => {
    if (isGoalState) return;
    const newLevel = currentLevel + 1;
    const prevActiveStates =
      [...stateArray[currentLevel]]?.filter((state) => !state.isRecursive) ||
      [];

    const newStateArray = []; // empty array to store new states for new depth level

    const performAction = (state, i, j, action) => {
      const newState = { ...state };
      const newData = JSON.parse(JSON.stringify(newState.data));

      switch (action) {
        case 'u':
          if (i === 0) return;
          newData[i][j] = newData[i - 1][j];
          newData[i - 1][j] = 0;
          break;
        case 'l':
          if (j === 0) return;
          newData[i][j] = newData[i][j - 1];
          newData[i][j - 1] = 0;
          break;
        case 'd':
          if (i === 2) return;
          newData[i][j] = newData[i + 1][j];
          newData[i + 1][j] = 0;
          break;
        case 'r':
          if (j === 2) return;
          newData[i][j] = newData[i][j + 1];
          newData[i][j + 1] = 0;
          break;
        default:
          break;
      }

      if (checkRecursive(newData, newStateArray)) {
        newState.isRecursive = true;
        // return;
      }
      newState.data = newData;
      newState.action = action;
      // newState.id = `${newState.id}${nodeCount++}`;
      newState.id = `${state.id}${newStateArray.length}`;
      newState.parentId = `${state.id}`;
      newState.currentLevel = newLevel;

      newStateArray.push(newState);

      if (checkGoalState(newData)) {
        newState.isGoal = true;
        console.log(`Goal State Reached at id ${newState.id}`);
        setIsGoalState(true);
      }
    };

    prevActiveStates.forEach((state) => {
      const { data } = state;
      const { i, j } = findZero(data);

      performAction(state, i, j, 'u');
      performAction(state, i, j, 'l');
      performAction(state, i, j, 'd');
      performAction(state, i, j, 'r');
    });

    setStateArray((prevState) => {
      prevState[newLevel] = newStateArray;
      return [...prevState];
    });

    setCurrentLevel(newLevel);
  };

  useEffect(() => {
    if (!isGoalState) {
      performStateSpaceSearch();
    }
  }, [currentLevel, isGoalState]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-center font-bold ">
        Eight Puzzle Problem State Space Tree
      </h1>

      <ArcherContainer
        strokeColor="gray"
        noCurves={false}
        startMarker={true}
        endMarker={false}
      >
        <div className="flex flex-col justify-center items-center">
          {stateArray.map((items, parentIndex) => (
            <div key={parentIndex} className="flex gap-4">
              {items.map((item, childIndex) => (
                <div
                  className="flex items-center mx-[20px] my-[50px] gap-2"
                  key={childIndex}
                >
                  <ArcherElement
                    id={item.id}
                    relations={[
                      {
                        targetId: item.parentId,
                        sourceAnchor: 'top',
                        targetAnchor: 'bottom',
                        label: item.action,
                        style: { strokeWidth: 2 },
                        startMarker: true,
                      },
                    ]}
                  >
                    <PuzzleBox state={item} ref={myRef} />
                  </ArcherElement>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ArcherContainer>
    </div>
  );
};

export default EightPuzzle;
