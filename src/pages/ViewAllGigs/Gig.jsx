import styles from "./Gig.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllGigs } from "../../apis/Gigs";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../../apis/Categories";
import { useQuery } from "@tanstack/react-query";

export default function MyGigs() {
  const navigate = useNavigate();
  const { userState } = useAuthContext();
  const { data: categories, loading } = useQuery({
    queryFn: getCategories,
    queryKey: ["categories"],
  });
  const user_id = userState.user_id;
  const [showCat, setShowCat] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [showBudget, setShowBudget] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["gigs", user_id],
    queryFn: ({ pageParam = 1 }) => fetchAllGigs(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.gigs.length > 0 ? pages.length + 1 : undefined;
    },
  });

  const handleCardClick = (gig) => {
    navigate(`/gig/${gig.gig_id}`, {
      state: { gig },
    });
  };

  const handleCheckBoxChange = (e) => {
    const { value, checked } = e.target;
    setFilteredCategory((prev) =>
      checked ? [...prev, value] : prev.filter((fc) => fc !== value)
    );
  };

  const filteredData = useMemo(() => {
    return data?.pages.flatMap((page) =>
      page.gigs.filter((gig) => {
        return (
          !filteredCategory.length ||
          filteredCategory.includes(gig.category_name)
        );
      })
    );
  }, [data, filteredCategory]);

  const sortedData = useMemo(() => {
    if (!filteredData) return [];
    if (sortOrder === "ASC") {
      return [...filteredData].sort((a, b) => a.budget - b.budget);
    }
    if (sortOrder === "DESC") {
      return [...filteredData].sort((a, b) => b.budget - a.budget);
    }
    return filteredData;
  }, [filteredData, sortOrder]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading gigs!</div>;

  return (
    <div className={styles.myGig}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>HIRE &gt; ALL GIGS &gt;&gt;</div>
        <h2>Your Gigs</h2>
        <div className={styles.about}>View All Gigs Available &gt;&gt;</div>
      </div>
      <div
        className={styles.filterCat}
        style={{
          border: "1px solid gray",
          width: "5%",
          padding: "0.5%",
          marginLeft: "2.5%",
          marginBottom: "2.5%",
        }}
      >
        <span>
          <i className="fas fa-filter"></i>{" "}
        </span>
        <span
          style={{ color: "grey" }}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filter
        </span>
      </div>
      <hr className={styles.break} />
      <div className={styles.gigFilter}>
        {showFilter && (
          <div className={styles.filtering}>
            <div className={styles.filterCat}>
              Categories
              <button
                className={styles.navButton}
                onClick={() => setShowCat((prev) => !prev)}
              >
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
            {!showCat && (
              <div className={styles.scrollableContainer}>
                {categories?.map((category) => (
                  <div key={category.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      value={category.category_name}
                      onChange={handleCheckBoxChange}
                    />
                    <label>{category.category_name}</label>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.filterCat}>
              Budget
              <button
                className={styles.navButton}
                onClick={() => setShowBudget((prev) => !prev)}
              >
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
            {showBudget && (
              <div className={styles.BudgetContainer}>
                <div className={styles.checkboxItem}>
                  <input
                    type="radio"
                    name="sortOrder"
                    value="ASC"
                    onChange={(e) => setSortOrder(e.target.value)}
                  />
                  <label>Low To High</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input
                    type="radio"
                    name="sortOrder"
                    value="DESC"
                    onChange={(e) => setSortOrder(e.target.value)}
                  />
                  <label>High To Low</label>
                </div>
              </div>
            )}
          </div>
        )}
        <div className={styles.gigsHolder}>
          {sortedData?.map((gig, gigIndex) => (
            <div
              key={gigIndex}
              className={styles.gigCard}
              onClick={() => handleCardClick(gig)}
            >
              <div className={styles.gigImage}>
                <img src={gig.picture[0]} alt="gigImage" />
              </div>
              <div className={styles.creator}>
                <div>{gig.freelancer_name}</div>
                <div>⭐ {gig.freelancer_rating}</div>
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
