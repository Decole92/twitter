import React from "react";
export default function News({ article }) {
  return (
    <a rel="noreferrer" href={article.url} target="_blank">
      <div className="my-5 px-4 hover:bg-gray-200 rounded-lg transition-all duration-200">
        <div className="flex justify-between p-2 items-center space-x-2">
          <h6>{article.title}</h6>
          <img className="h-10 rounded-lg" src={article.urlToImage} />
        </div>
      </div>
    </a>
  );
}
