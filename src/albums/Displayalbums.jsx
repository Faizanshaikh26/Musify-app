import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import { usePlayer } from '../Context/PlayerContext';
import clockicon from '../assets/clock_icon.png';
import Footer from '../Components/Footer';

function Displayalbums() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playWithId } = usePlayer();

  const fetchAlbum = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://musify-rest-api.onrender.com/api/${id}`); // Update with your API endpoint
      setAlbum(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching album:', error);
      setError(error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const totalDuration = useMemo(() => {
    return (album?.songs.reduce((acc, song) => acc + song.duration, 0) / 60).toFixed(2);
  }, [album]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching album. Please try again later.</div>;
  }

  if (!album) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="mt-6 flex gap-5 flex-col md:flex-row md:items-end">
        <div className="w-48 h-48 rounded overflow-hidden">
          <img src={album.albumImage} alt={album.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-4xl font-bold mb-3 md:text-7xl">{album.title}</h2>
          <h4 className="text-sm">{album.description}</h4>
          <p className="mt-1 flex items-center">
            <img className="inline-block w-5 h-5 mr-1" src="/path-to-spotify-logo.png" alt="Spotify Logo" />
            <b>Spotify</b>
            <b className="ml-1">{album.songs.length} songs</b>
            <span className="ml-1">{totalDuration} min</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-5 mb-4 pl-2 text-[#a7a7a7]">
        <p className="flex items-center col-span-1">
          <b className="mr-2">#</b>Title
        </p>
        <p className="flex items-center col-span-1 ml-3">Album</p>
        <p className="hidden sm:flex items-center col-span-1">Date</p>
        <div className="flex justify-center items-center col-span-1">
          <img src={clockicon} alt="Clock Icon" className="w-4" />
        </div>
      </div>

      <hr />

      {album.songs.map((song, index) => (
        <div key={index} className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer" onClick={() => playWithId(song._id)}>
          <div className="flex items-center col-span-1">
            <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
            <img src={song.songImage} alt="" className="inline w-10 h-10 mr-2 object-cover rounded" />
            <span className="truncate max-w-[10rem]">{song.title}</span>
          </div>
          <p className="text-[14px] ml-3 truncate max-w-[8rem] col-span-1">{song.artist}</p>
          <p className="text-[15px] hidden sm:block truncate max-w-[6rem] col-span-1">5 days</p>
          <p className="text-[15px] text-center truncate col-span-1">{(song.duration / 60).toFixed(2)} min</p>
        </div>
      ))}
      <Footer/>
      
    </>
  );
}

export default Displayalbums;
