import React, { createContext, useContext, useEffect, useState, useRef } from "react";

export const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export const PlayerContextProvider = ({ children }) => {
  const seekBg = useRef(null);
  const seekBar = useRef(null);
  const seekRing = useRef(null);
  const [albumData, setAlbumData] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });
  

  const fetchAlbumData = async () => {
    try {
      const response = await fetch("https://musify-restapi.onrender.com", {
        method: "GET",
        headers: {},
      });

      if (response.ok) {
        const result = await response.json();
        setAlbumData(result.albums);
        if (result.albums.length > 0 && result.albums[0].songs.length > 0) {
          setCurrentTrack({ albumIndex: 0, songIndex: 0, ...result.albums[0].songs[0] });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlbumData();
  }, []);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error while starting playback:', error);
          });
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
 
  const nextTrack = async () => {
    if (currentTrack && albumData.length > 0) {
      const { albumIndex, songIndex } = currentTrack;
      const currentAlbum = albumData[albumIndex];
      if (currentAlbum && songIndex < currentAlbum.songs.length - 1) {
        await setCurrentTrack({
          ...currentAlbum.songs[songIndex + 1],
          albumIndex,
          songIndex: songIndex + 1,
        });
        await audioRef.current.play();
        setIsPlaying(true);
      } else if (albumIndex < albumData.length - 1) {
        await setCurrentTrack({
          ...albumData[albumIndex + 1].songs[0],
          albumIndex: albumIndex + 1,
          songIndex: 0,
        });
        await audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  const previousTrack = async () => {
    if (currentTrack && albumData.length > 0) {
      const { albumIndex, songIndex } = currentTrack;
      const currentAlbum = albumData[albumIndex];
      if (songIndex > 0) {
        await setCurrentTrack({
          ...currentAlbum.songs[songIndex - 1],
          albumIndex,
          songIndex: songIndex - 1,
        });
        await audioRef.current.play();
        setIsPlaying(true);
      } else if (albumIndex > 0) {
        await setCurrentTrack({
          ...albumData[albumIndex - 1].songs[albumData[albumIndex - 1].songs.length - 1],
          albumIndex: albumIndex - 1,
          songIndex: albumData[albumIndex - 1].songs.length - 1,
        });
        await audioRef.current.play();
        setIsPlaying(true);
      }
      setCurrentTime(0); // Reset current time to 0 when switching to the previous track
    }
  };
  
  

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      setIsLoaded(false);
      audioRef.current.src = currentTrack.songUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      audioRef.current.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
      });
      if (isPlaying) {
        play();
      }
    }
  }, [currentTrack, isPlaying]);



  useEffect(() => {
    const updateSeekBarWidth = () => {
      if (audioRef.current && audioRef.current.duration) {
        const { currentTime, duration } = audioRef.current;
        const percentage = (currentTime / duration) * 100;
        seekBar.current.style.width = `${percentage}%`;
        seekRing.current.style.left = `${percentage}%`;
  
        setTime({
          currentTime: {
            second: Math.floor(currentTime % 60),
            minute: Math.floor(currentTime / 60),
          },
          totalTime: {
            second: Math.floor(duration % 60),
            minute: Math.floor(duration / 60),
          },
        });
      }
    };
  
    audioRef.current.ontimeupdate = updateSeekBarWidth;
  
    return () => {
      audioRef.current.ontimeupdate = null; // Cleanup
    };
  }, []);
  

  const seek = (event) => {
    const seekBgRect = seekBg.current.getBoundingClientRect();
    const offsetX = event.clientX - seekBgRect.left;
    const newTime = (offsetX / seekBgRect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const handleMouseMove = (event) => {
    if (seekRing.current && seekRing.current.isDragging) {
      const seekBgRect = seekBg.current.getBoundingClientRect();
      let offsetX = event.clientX - seekBgRect.left;

      // Ensure the offset is within the bounds of the seek bar
      offsetX = Math.max(0, Math.min(offsetX, seekBgRect.width));

      const newTime = (offsetX / seekBgRect.width) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleMouseDown = () => {
    if (seekRing.current) {
      seekRing.current.isDragging = true;
    }
  };

  const handleMouseUp = () => {
    if (seekRing.current) {
      seekRing.current.isDragging = false;
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const playWithId = async (songId) => {
    console.log('Attempting to play song with ID:', songId);
    console.log('Album data:', albumData); // Make sure albumData is populated
    const song = albumData.flatMap(album => album.songs).find(song => song._id === songId);
    console.log('Found song:', song); // Check if the song is found
    if (song) {
      // Find the album index and song index
      const albumIndex = albumData.findIndex(album => album.songs.includes(song));
      const songIndex = albumData[albumIndex].songs.findIndex(s => s._id === songId);
      await setCurrentTrack({ ...song, albumIndex, songIndex });
      console.log('Current track set:', currentTrack); // Check if currentTrack is set
      await audioRef.current.play();
      console.log('Audio playing:', audioRef.current); // Check if audio is playing
      setIsPlaying(true);
      console.log('IsPlaying:', isPlaying); // Check if isPlaying is set to true
    } else {
      console.log('Song with ID', songId, 'not found in the album.');
    }
  };
  
  
  


 


  const contextValue = {
    albumData,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    play,
    pause,
    nextTrack,
    previousTrack,
    isLoaded,
    audioRef,
    currentTime,
    setCurrentTime,
    time,
    seek,
    handleMouseDown,
    seekBar,
    seekBg,
    seekRing,
    playWithId
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
      <audio ref={audioRef} preload="auto" />
    </PlayerContext.Provider>
  );
};
