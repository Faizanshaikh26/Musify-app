import React from 'react';
import Sidebar from './Components/Sidebar';
import './App.css';
import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Displayalbums from './albums/Displayalbums';
import Player from './Components/Player';
import { usePlayer } from './Context/PlayerContext';

function App() {
  const { audioRef } = usePlayer();

  return (
    <div className='bg-black text-white h-full'>
      <Sidebar>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/album/:id' element={<Displayalbums />} />
        </Routes>
        <Player />
      </Sidebar>
      <audio ref={audioRef} preload='auto' />
    </div>
  );
}

export default App;
