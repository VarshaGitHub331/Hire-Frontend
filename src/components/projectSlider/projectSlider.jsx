import React from "react";
import Slider from "react-slick";
import { getTopRatedGigs } from "../../apis/Gigs.js";
import ProjectCard from "../projectCards/projectCards.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@tanstack/react-query";
export default function Projects() {
  const { data: topProjects, isLoading } = useQuery({
    queryFn: () => getTopRatedGigs(),
    queryKey: ["topGigs"],
  });
  console.log("Projects array: ", topProjects); // Check if projects array is defined and has data

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
    <Slider {...settings}>
      {topProjects?.length > 0 ? (
        topProjects?.map((ele, index) => (
          <div key={index} style={{ display: "flex" }}>
            <ProjectCard item={ele} />
          </div>
        ))
      ) : (
        <div>No projects available</div> // Handle the case where no projects are available
      )}
    </Slider>
  );
}
