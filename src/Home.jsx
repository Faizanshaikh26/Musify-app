import React from 'react'
import Slider from './Components/Slider'
import Navbar from './Components/Navbar'
import Loki from './Components/Loki'
import DisplayHome from './Components/DisplayHome'

function Home() {
  return (
    <>
     <div className='w-[100%] mt-1 px-2 rounded bg-[#212020] text-white overflow-auto '>
   <Navbar/>
    <Slider/>
{/* <Loki/> */}
   <DisplayHome/>



     </div>
    </>
  )
}

export default Home