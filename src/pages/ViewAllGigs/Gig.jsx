import styles from "./Gig.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllGigs } from "../../apis/Gigs";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCategories } from "../../apis/Categories";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [filterBudget, setFilterBudget] = useState();
  const [showFilter, setShowFilter] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [ratingOrder, setRatingOrder] = useState("");
  const [showBudget, setShowBudget] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const location = useLocation();
  const [projectDetails, setProjectDetails] = useState(location.state || null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["gigs", projectDetails],
    queryFn: ({ pageParam = 1 }) => fetchAllGigs(pageParam, projectDetails),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.gigs.length > 0 ? pages.length + 1 : undefined;
    },
    onSuccess: () => {
      setProjectDetails(null); // Clear project details after first query
    },
    staleTime: 0, // Forces the query to be considered stale immediately
    cacheTime: 0, // Removes the cached data immediately after use
  });

  useEffect(() => {
    if (data?.pages.length > 0) {
      for (let page of data.pages) {
        if (page.extracted_categories && page.extracted_categories.length > 0) {
          // Use data.pages instead of pages

          setFilteredCategory((filteredCategory) => [
            ...page.extracted_categories,
          ]);
        }

        if (page.extracted_budget) {
          setFilterBudget(page.extracted_budget);
        }
      }
    }
  }, [data]);

  const handleCardClick = (gig) => {
    navigate(`/viewGig/${gig.gig_id}`, {
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
    console.log("Here");
    return data?.pages.flatMap((page) =>
      page.gigs.filter((gig) => {
        return (
          (!filteredCategory.length ||
            filteredCategory.includes(gig.category_name)) &&
          (!filterBudget || gig.budget <= filterBudget)
        );
      })
    );
  }, [data, filteredCategory]);
  console.log(filteredData);
  const sortedData = useMemo(() => {
    console.log("here too");
    if (!filteredData) return [];
    if (sortOrder === "ASC") {
      return [...filteredData].sort((a, b) => a.budget - b.budget);
    }
    if (sortOrder === "DESC") {
      return [...filteredData].sort((a, b) => b.budget - a.budget);
    }
    return filteredData;
  }, [filteredData, sortOrder]);

  const ratedData = useMemo(() => {
    if (sortedData) {
      if (ratingOrder === "highRating")
        return [...sortedData].sort(
          (a, b) => a.freelancer_rating - b.freelancer_rating
        );
      else return sortedData;
    } else if (filteredData) {
      if (ratingData === "highRating")
        return [...filteredData].sort(
          (a, b) => a.freelancer_rating - b.freelancer_rating
        );
      else return filteredData;
    } else return [];
  }, [filteredData, sortedData, ratingOrder]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <div className={styles.myGig}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>HIRE &gt; ALL GIGS &gt;&gt;</div>
      </div>
      <div className={styles.filterIcon}>
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
                      checked={filteredCategory.includes(
                        category.category_name
                      )}
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

            <div className={styles.filterCat}>
              Ratings
              <button
                className={styles.navButton}
                onClick={() => setShowRating((prev) => !prev)}
              >
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
            {showRating && (
              <div className={styles.BudgetContainer}>
                <div className={styles.checkboxItem}>
                  <input
                    type="radio"
                    name="highRating"
                    value="highRating"
                    onChange={(e) => setRatingOrder(e.target.value)}
                  />
                  <label>Show High Rating</label>
                </div>
              </div>
            )}
          </div>
        )}
        <div className={styles.gigsHolder}>
          {ratedData?.map((gig, gigIndex) => (
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
                <div>⭐ {gig.freelancer_rating?.toFixed(1)}</div>
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
