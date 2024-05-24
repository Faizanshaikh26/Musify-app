import React, { useState, useEffect, useRef } from 'react';

const slides = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1422&q=80",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1544144433-d50aff500b91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1501527459-2d5409f8cf9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBjb25zZXJ0fGVufDB8fDB8fHww",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRvcCUyMDIwJTIwbXVzaWN8ZW58MHx8MHx8fDA%3D",
  },
];


const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef();

  useEffect(() => {
    startSlideTimer();
    return () => stopSlideTimer();
  }, []);

  const startSlideTimer = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
  };

  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  const switchSlide = (index) => {
    setCurrentSlide(index);
    stopSlideTimer();
    startSlideTimer();
  };

  return (
    <div className="relative w-full overflow-hidden mt-3 rounded">
    <div className="relative h-40 md:h-80 lg:h-96  ">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="h-full bg-cover bg-left-[50%] "
            style={{ backgroundImage: `url(${slide.img})` }}
          />
        </div>
      ))}
    </div>
    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 md:pb-4">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => switchSlide(index)}
          className={`w-2 h-2 md:w-3 md:h-3 mx-1 md:mx-2 rounded-full ${
            index === currentSlide ? 'bg-purple-800' : 'bg-purple-400'
          }`}
        />
      ))}
    </div>
  </div>
  );
};

export default Slider;
