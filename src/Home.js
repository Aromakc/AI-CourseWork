import React from 'react';
import Card from './component/Card';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700">
      <div className="flex flex-col gap-10">
        <Card
          title="Missionaries and Cannibals Problem"
          image="missionaries.png"
          onClick={() => {
            navigate('/1');
          }}
        />
        <Card
          title="Eight Puzzle Problem"
          image="eightpuzzle.png"
          onClick={() => {
            navigate('/2');
          }}
        />
      </div>
    </div>
  );
};

export default Home;
