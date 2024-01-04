import React, { useEffect } from 'react';
import PuzzleBox from './component/PuzzleBox';
import { useState, useRef } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

let nodeCount = 1;
let stack = []; // Stack for DFS
const initialState = {
  data: [
    [2, 8, 3],
    [1, 6, 4],
    [7, 0, 5],
  ],
  isRecursive: false,
  isGoal: false,
  level: 0,
  id: '1',
  parentId: '',
  action: '',
  isVisited: false,
};
stack = [initialState];

const EightPuzzleDFS = () => {
  const myRef = useRef(null);

  const goalState = [
    [8, 0, 3],
    [2, 6, 4],
    [1, 7, 5],
  ];

  const maxLevel = 4;
  const [currentState, setCurrentState] = useState([[initialState]]);
  const [isGoalState, setIsGoalState] = useState(false);
  const [id, setId] = useState(1);
  
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

    if (checkRecursive(newData, stack)) {
      newState.isRecursive = true;
      return false;
    }
    newState.data = newData;
    newState.action = action;
    newState.id = `${++nodeCount}`;
    newState.parentId = `${state.id}`;
    newState.level = state.level + 1;
    newState.isVisited = false;

    const goal = checkGoalState(newData);
    if (goal) {
      newState.isGoal = true;
      setIsGoalState(true);
    }
    stack.push(newState);

    // Add the new formed state to the currentState array
    setCurrentState((prevState) => {
      let tempState = [...prevState];
      if (!tempState[newState.level]) {
        tempState[newState.level] = []; // create sub-array if it doesn't exist
      }
      tempState[newState.level].push(newState);
      return tempState;
    });
    return goal;
  };

  const performStateSpaceSearchDFS = () => {
    console.log('stack length', stack.length);
    console.log('stack before action', stack);
    let lastStackIndex = stack.length - 1;
    let TOS = stack[lastStackIndex];

    if (TOS.isRecursive || TOS.level === maxLevel) {
      TOS.isVisited = true;
      console.log('Recursive state found');
      stack.pop();
      console.log('Stack after pop', stack);
      return;
    }

    if (
      stack.length > 0 &&
      TOS.isVisited === false &&
      TOS.level <
      
      
      maxLevel &&
      TOS.isRecursive === false
    ) {
      stack[lastStackIndex].isVisited = true;
      const { data } = TOS;
      const { i, j } = findZero(data);
      let isGoal = false;
      for (const direction of ['d', 'r', 'u', 'l']) {
        isGoal = performAction(TOS, i, j, direction);
        if (isGoal) {
          break;
        }
      }
      console.log('Stack after actions', stack);
      return;
    }
    if (stack.length === 0) {
      console.log('Goal state not found');
      return;
    }
    if (stack[lastStackIndex].isGoal) {
      console.log('Goal state found');
      setCurrentState((prevState) => {
        const newState = [...prevState];
        newState[stack[lastStackIndex].level] = [...stack];
        return newState;
      });
      return;
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl text-center font-bold ">
          Eight Puzzle Problem State Space Tree (DFS)
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={performStateSpaceSearchDFS}
        >
          New
        </button>
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
                        <PuzzleBox state={item} ref={myRef} algo ="DFS" />
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
