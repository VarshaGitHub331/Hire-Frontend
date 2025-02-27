import React from "react";
import Slider from "react-slick";
import CatCard from "../catCards/CatCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@tanstack/react-query";
import { getTopRatedGigs } from "../../apis/Gigs";
export default function Categories() {
  const { data: popularGigs, isLoading } = useQuery({
    queryFn: () => getTopRatedGigs(),
    queryKey: ["topGigs"],
  });
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default number of slides to show
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // For screens smaller than 1024px
        settings: {
          slidesToShow: 1, // Show 1 slide on smaller screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div style={{ marginTop: "2vh" }}>
      <Slider {...settings}>
        {popularGigs?.map((item, index) => (
          <div key={index} style={{ display: "flex", marginTop: "2vh" }}>
            <CatCard item={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
