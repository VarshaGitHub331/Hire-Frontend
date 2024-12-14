import styles from "./MyGig.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGigs } from "../../apis/Gigs";
import { useAuthContext } from "../../contexts/AuthContext";

export default function MyGigs() {
  const { userState } = useAuthContext();
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
    queryFn: ({ pageParam = 1 }) => fetchGigs(user_id, pageParam),
    getNextPageParam: (lastPage, pages) => {
      // Check if there are more gigs to fetch by ensuring the last page is not empty
      return lastPage.gigs.length > 0 ? pages.length + 1 : undefined;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error loading gigs!</div>;

  return (
    <div className={styles.myGig}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>HIRE &gt; MY GIGS &gt;&gt; </div>
        <h2>Your Gigs</h2>
        <div className={styles.about}>
          View All Gigs You Have Created &gt;&gt;
        </div>
      </div>
      <div className={styles.gigsHolder}>
        {data?.pages?.map((page, pageIndex) => (
          <div key={pageIndex} className={styles.gigRow}>
            {page.gigs.map((gig, gigIndex) => (
              <div key={gigIndex} className={styles.gigCard}>
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
