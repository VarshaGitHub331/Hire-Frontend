import styles from "./MyGig.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGigs } from "../../apis/Gigs";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function MyGigs() {
  const navigate = useNavigate();
  const { userState } = useAuthContext();
  const [categorySearch, setCategorySearch] = useState("");
  const [budgetLimit, setBudgetLimit] = useState(0);
  const { token } = userState;
  const user_id = userState.user_id;
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["gigs", user_id],
    queryFn: ({ pageParam = 1 }) => fetchGigs(user_id, pageParam, token),
    getNextPageParam: (lastPage, pages) => {
      // Check if there are more gigs to fetch by ensuring the last page is not empty
      return lastPage.gigs?.length > 0 ? pages.length + 1 : undefined;
    },
  });
  function handleCardClick(gig) {
    navigate(`/gig/${gig.gig_id}`, {
      state: { gig },
    });
  }
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error loading gigs!</div>;
  const filteredData = data?.pages.flatMap((page) =>
    page.gigs?.filter((gig) => {
      return (
        (!categorySearch ||
          gig.category_name
            .toLowerCase()
            .includes(categorySearch.toLowerCase())) &&
        (!budgetLimit || gig.budget <= parseInt(budgetLimit, 10))
      );
    })
  );

  // Check the length of the filtered data
  console.log("Filtered Data Length:", filteredData.length); // Use filteredData.length
  console.log("Filtered Data:", filteredData); // Log the actual data

  return (
    <div className={styles.myGig}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          HIRE &gt; MY GIGS &gt;&gt;{categorySearch}{" "}
        </div>
      </div>
      <div className={styles.filter}>
        <input
          type="text"
          className={styles.catFilter}
          placeholder="Filter By Category"
          value={categorySearch}
          onChange={(e) => {
            setCategorySearch(e.target.value);
          }}
        />
        <select
          value={budgetLimit || ""}
          onChange={(e) => setBudgetLimit(Number(e.target.value))}
        >
          <option value="">Budget</option>
          <option value="1500">&lt; ₹1,500</option>
          <option value="2500">&lt; ₹2,500</option>
          <option value="5000">&lt; ₹5,000</option>
          <option value="10000">&lt; ₹10,000</option>
          <option value="20000">&lt; ₹20,000</option>
          <option value="50000">&lt; ₹50,000</option>
          <option value="100000">&lt; ₹1,00,000</option>
          <option value="200000">&lt; ₹2,00,000</option>
          <option value="500000">&lt; ₹5,00,000</option>
        </select>
      </div>
      <div className={styles.gigsHolder}>
        {filteredData?.map((gig, gigIndex) => (
          <div
            key={gigIndex}
            className={styles.gigCard}
            onClick={(e) => {
              handleCardClick(gig);
            }}
          >
            <div className={styles.gigImage}>
              <img src={gig.picture[0]} alt="gigImage" />
            </div>
            <div className={styles.gigTitle}>{gig.title}</div>
            <div className={styles.gigCategories}>
              Category:
              <div className={styles.catTag}>{gig.category_name}</div>
            </div>
            <div className={styles.budget}>&#8377; {gig.budget}</div>
          </div>
        ))}
      </div>
      {hasNextPage && (
        <div className={styles.loadMore}>
          <button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? "LOADING..." : "SHOW MORE"}
          </button>
        </div>
      )}
    </div>
  );
}
