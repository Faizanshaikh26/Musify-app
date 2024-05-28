import React, { useState } from "react";

function App() {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch("https://musify-rest-api.onrender.com/", {
        method: "GET",
        headers: {},
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.albums);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button className="" onClick={getData}>
        Get Data
      </button>

      {data.map((album) => (
        <div key={album._id}>
          <h1>{album.title}</h1>
          {album.songs.map((song) => (
            <div key={song._id}>
              <p>{song.title}</p>
              <img src={song.songImage} alt={song.title} />
              <p>{song.songImage}</p>
              <audio controls>
                <source src={song.songUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              {/* Add more song details here */}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default App;
