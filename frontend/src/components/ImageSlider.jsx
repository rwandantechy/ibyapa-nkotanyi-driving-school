
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";


// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageSlider = () => {
  const slides = [
    {
      id: 1,
      image: "./images/sign_1.png",
      title: "Beautiful Mountain",
    },
    {
      id: 2,
      image: "./images/sign_2.png",
      title: "Ocean View",
    },
    {
      id: 3,
      image: "./images/sign_4.png",
      title: "City Lights",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto relative group">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        modules={[Navigation, Pagination, Autoplay]}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative">
              <img src={slide.image} alt={slide.title} className="mx-auto h-96 w-auto rounded" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
