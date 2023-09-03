import React from 'react';
import { useState, useEffect } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';

const Home = () => {
  const initialState = {
    M: 3,
    C: 3,
    boat: false,
    currentLevel: 0,
    id: '1', // root node is 1
    parentId: '',
    isDead: false,
    isRecursive: false,
    action: '',
  };

  const [currentLevel, setCurrentLevel] = useState(0);
  const [stateArray, setStateArray] = useState([[initialState]]);
  const [isGoalState, setIsGoalState] = useState(false);

  const isRecursive = (stateToCheck, currentArray) => {
    for (const state of stateArray) {
      for (const item of state) {
        if (
          item.M === stateToCheck.M &&
          item.C === stateToCheck.C &&
          item.boat === stateToCheck.boat
        ) {
          return true;
        }
      }
    }

    for (const item of currentArray) {
      if (
        item.M === stateToCheck.M &&
        item.C === stateToCheck.C &&
        item.boat === stateToCheck.boat
      ) {
        return true;
      }
    }

    return false;
  };

  const isGoalStateReached = (state) => {
    return state.M === 0 && state.C === 0;
  };

  const generatePossibleState = () => {
    if (isGoalState) return;
    const tempLevel = currentLevel + 1;
    const previousLevelStates =
      [...stateArray[currentLevel]]?.filter(
        (state) => !state.isDead && !state.isRecursive
      ) || [];

    // console.dir(previousLevelStates);
    // console.log(`Level ${currentLevel}`);

    const newStateArray = [];

    const performAction = (state, action, MChange, CChange) => {
      const newState = { ...state };
      newState.M += MChange;
      newState.C += CChange;
      newState.currentLevel = newState.currentLevel + 1;
      newState.boat = !newState.boat;

      // check if the state exceeds the limit of missionaries and cannibals
      if (
        newState.M < 0 ||
        newState.M > 3 ||
        newState.C < 0 ||
        newState.C > 3
      ) {
        return;
      }

      // check if the state is valid or not
      if (
        newState.M >= 0 &&
        newState.M <= 3 &&
        newState.C >= 0 &&
        newState.C <= 3 &&
        (newState.M === 0 ||
          3 - newState.M === 0 ||
          (newState.M >= newState.C && 3 - newState.M >= 3 - newState.C))
      ) {
        const result = isRecursive(newState, newStateArray);
        if (result) newState.isRecursive = true;
      } else {
        newState.isDead = true;
      }

      newState.action = action;
      newState.id = `${state.id}${newStateArray.length}`;
      newState.parentId = `${state.id}`;
      newStateArray.push(newState);

      if (isGoalStateReached(newState)) {
        setIsGoalState(true);
      }
    };

    previousLevelStates.forEach((state) => {
      if (!state.boat) {
        performAction(state, '[1,0]', -1, 0);
        performAction(state, '[2,0]', -2, 0);
        performAction(state, '[0,1]', 0, -1);
        performAction(state, '[0,2]', 0, -2);
        performAction(state, '[1,1]', -1, -1);
      } else {
        performAction(state, '[1,0]', 1, 0);
        performAction(state, '[2,0]', 2, 0);
        performAction(state, '[0,1]', 0, 1);
        performAction(state, '[0,2]', 0, 2);
        performAction(state, '[1,1]', 1, 1);
      }
    });

    setStateArray((prevState) => {
      prevState[tempLevel] = newStateArray;
      return [...prevState];
    });

    setCurrentLevel(tempLevel);
  };

  const getColor = (state) => {
    if (state.currentLevel === 0) return '#cedb5a';
    if (state.isRecursive) return '#a3a4a8';
    if (state.isDead) return '#b03923';
    if (state.M === 0 && state.C === 0 && state.boat) return '#70d44c';
    return '#cedb5a';
  };

  useEffect(() => {
    if (!isGoalState) {
      generatePossibleState();
    }
  }, [currentLevel]);

  return (
    <div>
      <h1 className="text-2xl text-center font-bold ">
        Missionaries and Cannibals State Space Tree
      </h1>

      <ArcherContainer
        strokeColor="gray"
        noCurves={false}
        startMarker={false}
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
                    <div
                      className={`p-3 flex justify-center items-center rounded-full border-2 w-20 h-20 text-white font-bold`}
                      style={{ backgroundColor: getColor(item) }}
                    >
                      {`[${item.M},${item.C},${!item.boat ? 'R' : 'L'}]`}
                    </div>
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

export default Home;
