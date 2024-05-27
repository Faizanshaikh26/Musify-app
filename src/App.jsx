import React, { Suspense, lazy } from 'react';
import Sidebar from './Components/Sidebar';
import './App.css';
import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Player from './Components/Player';
import { usePlayer } from './Context/PlayerContext';

// Lazy load the Displayalbums component
const Displayalbums = lazy(() => import('./albums/Displayalbums'));

function App() {
  const { audioRef } = usePlayer();

  return (
    <div className='bg-black text-white h-full'>
      <Sidebar>
       
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/album/:id' element={<Displayalbums />} />
          </Routes>
        </Suspense>
      </Sidebar>
      <audio ref={audioRef} preload='auto' />
    </div>
  );
}

export default App;
