import React from "react";
import styles from "./ClientJobBoard.module.css";
import { Link } from "react-router-dom";
import { fetchPostings } from "../../apis/JobPosting";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
const JobBoard = () => {
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
    queryKey: ["jobs", user_id],
    queryFn: ({ pageParam = 1 }) =>
      fetchPostings(user_id, pageParam, userState.token),
    getNextPageParam: (lastPage, pages) => {
      // Check if there are more gigs to fetch by ensuring the last page is not empty
      return lastPage.jobResults.length > 0 ? pages.length + 1 : undefined;
    },
  });
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const filteredData = useMemo(() => {
    return data?.pages.flatMap((page) =>
      page.jobResults.filter(
        (job) =>
          !jobTitle || job.title.toLowerCase().includes(jobTitle.toLowerCase())
      )
    );
  }, [data, jobTitle]);
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error loading Jobs!</div>;
  return (
    <>
      <div className={styles.direction}>
        <Link to="/">HIRE</Link> &gt;&gt;{" "}
        <Link to="/clientJobs">VIEW POSTINGS</Link>
      </div>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Job title or keyword"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
              }}
            />
            <button>Search</button>
          </div>
        </div>
        <div className={styles.content}>
          <main className={styles.jobs}>
            {filteredData.map((job, i) => (
              <div
                className={styles.jobCard}
                key={i}
                onClick={(e) => {
                  navigate(`/clientJobs/${job.job_id}`, {
                    state: {
                      job,
                    },
                  });
                }}
              >
                <div className={styles.jobTitle}>{job.title}</div>
                <p className={styles.tags}>
                  <span className={styles.expTag}>{job.experience}</span>{" "}
                  <span className={styles.typeTag}>{job.job_type}</span>
                </p>

                <p className={styles.desc}>{job.description}</p>
                <hr />
                <p className={styles.budget}>
                  {"\u20B9"} {parseInt(job.min_budget)} - {"\u20B9"}{" "}
                  {parseInt(job.max_budget)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/viewApplicants", {
                        state: {
                          job_id: job.job_id,
                        },
                      });
                    }}
                  >
                    VIEW APPLICANTS
                  </button>
                </p>
              </div>
            ))}
          </main>
        </div>
      </div>
      {hasNextPage && (
        <div className={styles.loadMore}>
          <button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? "LOADING..." : "SHOW MORE"}
          </button>
        </div>
      )}
    </>
  );
};

export default JobBoard;
