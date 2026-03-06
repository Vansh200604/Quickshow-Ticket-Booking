import React from "react";
import { StarIcon } from "lucide-react";
import DateFormat from "../../lib/DateFormat";

function ShowCard({ show, currency }) {
  return (
    <div className="w-55 rounded-lg overflow-hidden h-full pb-3 
                    bg-primary/10 border border-primary/20 
                    hover:scale-105 hover:shadow-lg hover:shadow-primary transition duration-300 ">

      <img
        src={show.movie.poster_path}
        alt={show.movie.title}
        className="h-60 w-full object-cover"
      />

      <p className="font-medium p-2 truncate">{show.movie.title}</p>

      <div className="flex items-center justify-between px-2">
        <p className="text-lg font-medium">
          {currency} {show.showPrice}
        </p>

        <p className="flex items-center gap-1 text-sm text-gray-400">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {show.movie.vote_average?.toFixed(1)}
        </p>
      </div>

      <p className="text-xs text-gray-400 px-2 mt-1">
        {DateFormat(show.showDateTime)}
      </p>
    </div>
  );
}

export default ShowCard;