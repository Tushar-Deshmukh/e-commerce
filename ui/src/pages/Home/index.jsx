import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import banner5 from "../../assets/images/banner5.jpg";
import banner6 from "../../assets/images/banner6.jpg";
import banner7 from "../../assets/images/banner7.jpg";
import banner8 from "../../assets/images/banner8.jpg";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Left column */}
      <div className="order-1 lg:order-1 mb-3 px-3 md:px-2 w-full lg:w-1/4">
        <div className="flex flex-col justify-between h-full">
          <img
            src={banner5}
            className="mb-3 h-[calc(50%-0.375rem)] object-cover"
          />
          <img src={banner6} className="h-[calc(50%-0.375rem)] object-cover" />
        </div>
      </div>

      {/* Center Carousel */}
      <div className="order-2 mb-3 px-3 md:px-2 w-full lg:w-1/2 flex flex-col">
        <div className="flex-1 h-full">
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={false}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container h-full"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px h-full"
          >
            <img
              src={banner7}
              className="w-full h-full object-cover"
              alt="Banner 1"
            />
            <img
              src={banner8}
              className="w-full h-full object-cover"
              alt="Banner 2"
            />
          </Carousel>
        </div>
      </div>

      {/* Right column */}
      <div className="order-3 mb-3 px-3 md:px-2 w-full lg:w-1/4">
        <div className="flex flex-col justify-between h-full">
          <img
            src={banner6}
            className="mb-3 h-[calc(50%-0.375rem)] object-cover"
          />
          <img src={banner5} className="h-[calc(50%-0.375rem)] object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Home;
