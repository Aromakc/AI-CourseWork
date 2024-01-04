import React from 'react';

const PuzzleBoxDFS = React.forwardRef((props, ref) => {
  const item = props.state;
  const arr = item.data;
  const state = { isRecursive: item.isRecursive, isGoal: item.isGoal };
  return (
    <div ref={ref} className="flex justify-center items-center">
      <table className={`table-auto`}>
        <tbody>
          {arr.map((row, i) => (
            <tr key={i}>
              {row.map((col, j) => (
                <td
                  key={j}
                  title={`(h=${item.misplacedTiles},f=${item.manhattanDistance})`}
                  className={`
                    border-4
                    px-2  
                    ${
                      state.isDead
                        ? 'border-red-500'
                        : state.isGoal
                        ? 'border-green-500'
                        : state.isRecursive
                        ? 'border-gray-500'
                        : 'border-blue-500'
                    } 
                    ${col === 0 ? 'bg-gray-300' : ''}`}
                >
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PuzzleBoxDFS;
