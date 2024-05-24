import React from 'react'
import 'boxicons/css/boxicons.min.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  return (
    <>
    
    <div className='bg-gray-500 flex justify-between lg:h-10 mt-2'> 
        <div className='ml-5 space-x-2' >
        <i className='bx bxs-chevron-left  text-2xl cursor-pointer lg:text-4xl ' onClick={()=>navigate(-1)}   ></i>
        <i className='bx bxs-chevron-right text-2xl cursor-pointer lg:text-3xl'    onClick={()=>navigate(1)}></i>
        </div>
        <div className='mr-2 cursor-pointer lg:mr-4 '>
            <button className=' text-lg lg:lg:text-xl font-sans'>Login</button>
        </div>
    </div>
    
    </>
  )
}

export default Navbar