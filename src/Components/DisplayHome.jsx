import React from 'react'
import { usePlayer } from '../Context/PlayerContext'
import Albumitem from '../albums/Albumitem'

function DisplayHome() {
    const {albumData}=usePlayer()

    const keywords = ['Top 50 India', 'Top 50 Global'];
    const filteredAlbums = albumData.filter((album) =>
      keywords.some((keyword) => album.title.includes(keyword))
    );
  return (
 <>
  
  <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>

        {/* Render Filtered Albums by Title */}
        <div>
          <div className='flex overflow-auto'>
            {filteredAlbums.map((item, index) => (
              <Albumitem
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



 </>
  )
}

export default DisplayHome