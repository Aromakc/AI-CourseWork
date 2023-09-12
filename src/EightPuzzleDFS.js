import React, { useEffect } from 'react';
import PuzzleBox from './component/PuzzleBox';
import { useState, useRef } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

let nodeCount = 1;

const EightPuzzleDFS = () => {
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

  const queue = []; // empty array to store new states for new depth level
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentState, setCurrentState] = useState([[initialState]]);
  const [isGoalState, setIsGoalState] = useState(false);

  // Find the position of zero in the array and return the index
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
    // check if new data is in previous states
    for (const state of currentState) {
      for (const item of state) {
        if (JSON.stringify(item.data) === JSON.stringify(newData)) {
          return true;
        }
      }
    }

    // check if new data is in new formed states
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

  const performAction = (state, i, j, action) => {
    const newState = { ...state }; // copy the state to prevent mutation
    const newData = JSON.parse(JSON.stringify(newState.data));

    // swapping the zero with the number in the direction
    switch (action) {
      case 'u':
        if (i > 0) {
          [newData[i][j], newData[i - 1][j]] = [newData[i - 1][j], 0];
        }
        break;
      case 'l':
        if (j > 0) {
          [newData[i][j], newData[i][j - 1]] = [newData[i][j - 1], 0];
        }
        break;
      case 'd':
        if (i < 2) {
          [newData[i][j], newData[i + 1][j]] = [newData[i + 1][j], 0];
        }
        break;
      case 'r':
        if (j < 2) {
          [newData[i][j], newData[i][j + 1]] = [newData[i][j + 1], 0];
        }
        break;
      default:
        break;
    }

    if (checkRecursive(newData, queue)) {
      newState.isRecursive = true;
      return false;
    }
    newState.data = newData;
    newState.action = action;
    newState.id = `${++nodeCount}`;
    newState.parentId = `${state.id}`;
    newState.currentLevel = currentLevel + 1;

    queue.push(newState);

    if (checkGoalState(newData)) {
      newState.isGoal = true;
      console.log(`Goal State Reached at id ${newState.id}`);
      setIsGoalState(true);
      return true;
    }
    return false;
  };

  const performStateSpaceSearch = () => {
    const newLevel = currentLevel + 1;
    const prevActiveStates =
      [...currentState[currentLevel]]?.filter((state) => !state.isRecursive) ||
      [];
    for (const state of prevActiveStates) {
      const { data } = state;
      const { i, j } = findZero(data);
      let isGoal = false;
      for (const direction of ['u', 'l', 'd', 'r']) {
        isGoal = performAction(state, i, j, direction);
      }
      if (isGoal) {
        break;
      }
    }

    setCurrentState((prevState) => {
      const newState = [...prevState];
      newState[newLevel] = [...queue];
      return newState;
    });
    setCurrentLevel(newLevel);
    console.log(queue);
  };

  useEffect(() => {
    if (!isGoalState) {
      setTimeout(() => {
        performStateSpaceSearch();
      }, 1000);
    }
  }, [currentLevel, isGoalState]);

  return (
    <>
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
            {currentState.map((items, parentIndex) => (
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
                      <div className="flex flex-col justify-center items-center">
                        <PuzzleBox state={item} ref={myRef} />
                        <span className="text-sm font-semibold">{item.id}</span>
                      </div>
                    </ArcherElement>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ArcherContainer>
      </div>
    </>
  );
};

export default EightPuzzleDFS;
