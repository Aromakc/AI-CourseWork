import React from 'react';

const Card = (props) => {
  return (
    <div className="relative flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative mx-4 mt-4 h-96 overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700">
        <img
          src={props.image}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-6">
        <p className="block w-full text-center font-sans text-base font-semibold leading-relaxed text-blue-gray-900 antialiased">
          {props.title}
        </p>

        <button
          className="block w-full select-none rounded-lg bg-blue-gray-900/10 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-blue-gray-900 transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={props.onClick}
        >
          Show
        </button>
      </div>
    </div>
  );
};

export default Card;
