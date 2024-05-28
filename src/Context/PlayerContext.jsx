import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from "react";

export const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export const PlayerContextProvider = ({ children }) => {
  const seekBg = useRef(null);
  const seekBar = useRef(null);
  const seekRing = useRef(null);
  const [albumData, setAlbumData] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const fetchAlbumData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://musify-rest-api.onrender.com");
      if (response.ok) {
        const result = await response.json();
        setAlbumData(result.albums);
        if (result.albums.length > 0 && result.albums[0].songs.length > 0) {
          setCurrentTrack({ albumIndex: 0, songIndex: 0, ...result.albums[0].songs[0] });
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbumData();
  }, [fetchAlbumData]);

  const play = useCallback(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => console.error('Error while starting playback:', error));
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const loadTrack = useCallback(() => {
    if (audioRef.current && currentTrack) {
      setIsLoading(true);
      audioRef.current.src = currentTrack.songUrl;
      audioRef.current.load();
      audioRef.current.oncanplaythrough = () => {
        setIsLoading(false);
        play();
      };
    }
  }, [currentTrack, play]);

  const nextTrack = useCallback(() => {
    if (currentTrack && albumData.length > 0) {
      const { albumIndex, songIndex } = currentTrack;
      const currentAlbum = albumData[albumIndex];
      if (currentAlbum && songIndex < currentAlbum.songs.length - 1) {
        setCurrentTrack({
          ...currentAlbum.songs[songIndex + 1],
          albumIndex,
          songIndex: songIndex + 1,
        });
      } else if (albumIndex < albumData.length - 1) {
        setCurrentTrack({
          ...albumData[albumIndex + 1].songs[0],
          albumIndex: albumIndex + 1,
          songIndex: 0,
        });
      }
      audioRef.current.currentTime = 0;
      loadTrack();
    }
  }, [currentTrack, albumData, loadTrack]);

  const previousTrack = useCallback(() => {
    if (currentTrack && albumData.length > 0) {
      const { albumIndex, songIndex } = currentTrack;
      const currentAlbum = albumData[albumIndex];
      if (songIndex > 0) {
        setCurrentTrack({
          ...currentAlbum.songs[songIndex - 1],
          albumIndex,
          songIndex: songIndex - 1,
        });
      } else if (albumIndex > 0) {
        setCurrentTrack({
          ...albumData[albumIndex - 1].songs[albumData[albumIndex - 1].songs.length - 1],
          albumIndex: albumIndex - 1,
          songIndex: albumData[albumIndex - 1].songs.length - 1,
        });
      }
      audioRef.current.currentTime = 0;
      loadTrack();
    }
  }, [currentTrack, albumData, loadTrack]);

  useEffect(() => {
    if (currentTrack) {
      loadTrack();
    }
  }, [currentTrack, loadTrack]);

  useEffect(() => {
    const updateSeekBarWidth = () => {
      if (audioRef.current && audioRef.current.duration) {
        const { currentTime, duration } = audioRef.current;
        const percentage = (currentTime / duration) * 100;
        if (seekBar.current) seekBar.current.style.width = `${percentage}%`;
        if (seekRing.current) seekRing.current.style.left = `${percentage}%`;

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

    if (audioRef.current) {
      audioRef.current.ontimeupdate = updateSeekBarWidth;
      audioRef.current.addEventListener('ended', nextTrack);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.ontimeupdate = null;
        audioRef.current.removeEventListener('ended', nextTrack);
      }
    };
  }, [nextTrack]);

  const seek = useCallback((event) => {
    if (seekBg.current) {
      const seekBgRect = seekBg.current.getBoundingClientRect();
      const offsetX = event.clientX - seekBgRect.left;
      const newTime = (offsetX / seekBgRect.width) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (seekRing.current && seekRing.current.isDragging) {
      const seekBgRect = seekBg.current.getBoundingClientRect();
      let offsetX = event.clientX - seekBgRect.left;
      offsetX = Math.max(0, Math.min(offsetX, seekBgRect.width));
      const newTime = (offsetX / seekBgRect.width) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    if (seekRing.current) {
      seekRing.current.isDragging = true;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (seekRing.current) {
      seekRing.current.isDragging = false;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const playWithId = useCallback(async (songId) => {
    const song = albumData.flatMap(album => album.songs).find(song => song._id === songId);
    if (song) {
      const albumIndex = albumData.findIndex(album => album.songs.includes(song));
      const songIndex = albumData[albumIndex].songs.findIndex(s => s._id === songId);
      setCurrentTrack({ ...song, albumIndex, songIndex });
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      audioRef.current.addEventListener('canplaythrough', play, { once: true });
    }
  }, [albumData, play]);

  const contextValue = useMemo(() => ({
    albumData,
    currentTrack,
    isPlaying,
    isLoading,
    setCurrentTrack,
    play,
    pause,
    nextTrack,
    previousTrack,
    audioRef,
    currentTime,
    setCurrentTime,
    time,
    seek,
    handleMouseDown,
    seekBar,
    seekBg,
    seekRing,
    playWithId,
  }), [
    albumData,
    currentTrack,
    isPlaying,
    isLoading,
    play,
    pause,
    nextTrack,
    previousTrack,
    currentTime,
    time,
    seek,
    handleMouseDown,
    playWithId,
  ]);

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};
