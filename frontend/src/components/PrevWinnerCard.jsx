import React from "react";

const PreviousWinnerCard = ({ winner }) => {
  return (
    <div className="flex shrink-0 bg-gray-100 rounded-lg p-1 items-center gap-2">
      <div className="h-20 w-20 rounded-lg overflow-hidden bg-slate-200">
        <img
          className="h-20 w-20 object-cover"
          src={winner.imageUrl}
          alt={winner.name}
        />
      </div>
      <div className="flex flex-col shrink-0 p-2 gap-1 font-semibold text-sm">
        <p>{winner.name}</p>
        <p className="text-green-800">
          {winner.rank === 1 ? "1st" : winner.rank === 2 ? "2nd" : winner.rank === 3 ? "3rd" : "4th"}{" "}
          Rank
        </p>
      </div>
    </div>
  );
};

export default PreviousWinnerCard;