import React from "react";
import { usePlayer } from "../Context/PlayerContext";
import Albumitem from "../albums/Albumitem";


function DisplayHome() {
  const { albumData,playWithId } = usePlayer();
  const keywords = [
    "Top 100 India",
    "Top 50 Global",
    "Trending",
    "Most Romantic",
  ];
  const filteredAlbums = albumData.filter((album) =>
    keywords.some((keyword) => album.title.includes(keyword))
  );

  const singlekeywords = ["Most Romantic"];
  const filteredSingleAlbums = albumData.filter((singlealbum) =>
    singlekeywords.some((singlekeyword) =>
      singlealbum.title.toLowerCase().includes(singlekeyword.toLowerCase())
    )
  );

  return (
    <>

    <div className="">

   
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div>
          <div className="flex overflow-auto">
            {filteredAlbums.map((item, index) => (
              <Albumitem
                name={item.title}
                desc={item.description}
                image={item.albumImage}
                key={index}
                id={item._id}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
  <h1 className="my-5 font-bold text-2xl">Most Romantic</h1>
  <div className="flex overflow-auto">
    {filteredSingleAlbums.map((album, index) => {
      return (
        <div key={index} className="flex ">
          {album.songs.map((song, songIndex) => {
            return (
              <div
                key={songIndex}
                className="min-w-[180px] p-2 px-2 rounded cursor-pointer hover:bg-[#ffffff26] flex flex-col items-center" onClick={()=>playWithId(song._id)}
              >
                <img
                  src={song.songImage}
                  alt={song.title}
                  className="rounded w-40 h-40 object-cover"
                />
                <p className="font-bold mt-2 mb-1">{song.title}</p>
                {/* <p className='text-slate-200 text-sm'>{desc}</p> */}
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
</div>

      {/* <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Most Romatic</h1>
        <div className="flex overflow-auto">
          {filteredSingleAlbums.map((item, index) => (
            <Albumitem
              name={item.title}
              desc={item.description}
              image={item.albumImage}
              key={index}
              id={item._id}
            />
          ))}
        </div>
      </div> */}

  
</div>
    </>
  );
}

export default DisplayHome;
