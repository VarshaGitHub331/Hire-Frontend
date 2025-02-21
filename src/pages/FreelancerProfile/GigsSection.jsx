import React from "react";
import styles from "./GigsSection.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGigs } from "../../apis/Gigs";
import { useNavigate } from "react-router-dom";
const GigsSection = ({ user_id }) => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["gigs", user_id],
    queryFn: ({ pageParam = 1 }) => fetchGigs(user_id, pageParam),
    getNextPageParam: (lastPage, pages) => {
      // Check if there are more gigs to fetch by ensuring the last page is not empty
      return lastPage.gigs.length > 0 ? pages.length + 1 : undefined;
    },
  });
  function handleCardClick(gig) {
    navigate(`/gig/${gig.gig_id}`, {
      state: { gig },
    });
  }
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error loading gigs!</div>;
  const gigsData = data?.pages.flatMap((page) => page.gigs.map((gig) => gig));
  return (
    <section className={styles.gigsSection}>
      <h4 className={styles.heading}>My Gigs</h4>
      <div className={styles.gigsContainer}>
        {gigsData.map((gig, index) => (
          <div
            key={index}
            className={styles.gigCard}
            onClick={(e) => {
              handleCardClick(gig);
            }}
          >
            <img src={gig.picture} alt="Gig" className={styles.gigImage} />
            <p className={styles.gigTitle}>{gig.title}</p>
            <p className={styles.gigPrice}>From {gig.budget}</p>
          </div>
        ))}
      </div>
      <button
        className={styles.viewAllButton}
        onClick={(e) => {
          fetchNextPage();
        }}
      >
        View all (22)
      </button>
    </section>
  );
};

export default GigsSection;
