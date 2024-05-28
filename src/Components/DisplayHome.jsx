import React, { useEffect, useState, useCallback, useMemo } from "react";
import { usePlayer } from "../Context/PlayerContext";
import AlbumItem from '../albums/Albumitem';

function DisplayHome() {
  const [albumData, setAlbumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playWithId } = usePlayer();

  const fetchAlbumData = useCallback(async () => {
    const startTime = performance.now();
    try {
      const response = await fetch("https://musify-rest-api.onrender.com", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setAlbumData(data.albums);
    } catch (error) {
      console.error("Error fetching album data:", error);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      console.log(`Fetch and render time: ${endTime - startTime} ms`);
    }
  }, []);

  useEffect(() => {
    fetchAlbumData();
  }, [fetchAlbumData]);

  const keywords = useMemo(() => ["Top 100 India", "Top 50 Global", "Trending"], []);
  const singleKeywords = useMemo(() => ["Most Romantic"], []);

  const filteredAlbums = useMemo(() => {
    return albumData.filter((album) =>
      keywords.some((keyword) => album.title.includes(keyword))
    );
  }, [albumData, keywords]);

  const filteredSingleAlbums = useMemo(() => {
    return albumData.filter((singleAlbum) =>
      singleKeywords.some((singleKeyword) =>
        singleAlbum.title.toLowerCase().includes(singleKeyword.toLowerCase())
      )
    );
  }, [albumData, singleKeywords]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div>
          <div className="flex overflow-auto">
            {filteredAlbums.map((item, index) => (
              <AlbumItem
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
          {filteredSingleAlbums.map((album, index) => (
            <div key={index} className="flex">
              {album.songs.map((song, songIndex) => (
                <div
                  key={songIndex}
                  className="min-w-[180px] p-2 px-2 rounded cursor-pointer hover:bg-[#ffffff26] flex flex-col items-center"
                  onClick={() => playWithId(song._id)}
                >
                  <img
                    src={song.songImage}
                    alt={song.title}
                    className="rounded w-40 h-40 object-cover"
                  />
                  <p className="font-bold mt-2 mb-1">{song.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DisplayHome;
