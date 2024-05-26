import React, { useEffect, useState, useCallback } from "react";
import { usePlayer } from "../Context/PlayerContext";
import AlbumItem from '../albums/Albumitem';

function DisplayHome() {
  const [albumData, setAlbumData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const { playWithId } = usePlayer(); // Ensure usePlayer and playWithId are properly defined and used

  const fetchAlbumData = useCallback(async () => {
    try {
      console.log("Fetching album data...");
      const response = await fetch("https://musify-rest-api.onrender.com", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Response received:", response);
      const data = await response.json();
      console.log("Data received:", data);
      setAlbumData(data.albums);
    } catch (error) {
      console.error("Error fetching album data:", error);
    } finally {
      setLoading(false); // Set loading to false once fetch is complete
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now();
      await fetchAlbumData();
      const endTime = performance.now();
      console.log(`Fetch and render time: ${endTime - startTime} ms`);
    };

    fetchData();
  }, [fetchAlbumData]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  const keywords = [
    "Top 100 India",
    "Top 50 Global",
    "Trending",
    "Most Romantic"
  ];

  const filteredAlbums = albumData.filter((album) =>
    keywords.some((keyword) => album.title.includes(keyword))
  );

  const singleKeywords = ["Most Romantic"];
  const filteredSingleAlbums = albumData.filter((singleAlbum) =>
    singleKeywords.some((singleKeyword) =>
      singleAlbum.title.toLowerCase().includes(singleKeyword.toLowerCase())
    )
  );

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
