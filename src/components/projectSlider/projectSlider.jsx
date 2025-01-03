import React from "react";
import Slider from "react-slick";
import { projects } from "../../Data";
import ProjectCard from "../projectCards/projectCards.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Projects() {
  console.log("Projects array: ", projects); // Check if projects array is defined and has data

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
      {projects.length > 0 ? (
        projects.map((ele, index) => (
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
