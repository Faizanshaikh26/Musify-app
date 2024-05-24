import React from 'react'
import { usePlayer } from '../Context/PlayerContext'

function Loki() {
    const {albumData}=usePlayer()
    return (
      <>

<div className='bg-red-300 text-lime-800'>
{
    albumData.map((album)=>{
        return (
            <>
             <h1>{album.title}</h1>
      <h2>{album._id}</h2>
      <h2>{album.songs.title}</h2>
      {album.songs.map((song) => (
        <div key={song._id}>
          <p>{song.title}</p>
          <img src={song.songImage} alt={song.title} />
          <p>{song.songImage}</p>
          <audio controls>
            <source src={song.songUrl} type="audio/mpeg" />
            <p>{song.songUrl}</p>
            Your browser does not support the audio element.
          </audio>
          {/* Add more song details here */}
        </div>
      ))}
   
            </>
        )
    })
}
</div>
</>
  )
}

export default Loki