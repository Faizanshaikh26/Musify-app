import React from 'react';
import '../Styles/MusicLoader.css'; // Import the CSS file

const MusicLoader = () => {
  return (
    <div className="container">
      <div className="music-container">
        <div className="music-symbol">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-music">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        </div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
}

export default MusicLoader;
