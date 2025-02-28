import React, { useState } from "react";
import styles from "./FreelancerJobBoard.module.css";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { fetchPostingsForFreelancer } from "../../apis/JobPosting";
import { getAllSkills } from "../../apis/Skills";
import { getCategories } from "../../apis/Categories";
import Pop from "./JobPopUp";
const JobPostings = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { userState } = useAuthContext();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const user_id = userState.user_id;
  const token = userState.token;
  // Toggle filter sidebar
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Fetch job postings with pagination
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
      fetchPostingsForFreelancer(user_id, pageParam, token),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || !lastPage.jobs) return undefined;
      return lastPage.jobs.length > 0 ? pages.length + 1 : undefined;
    },
  });

  // Fetch categories & skills
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: getAllSkills,
  });

  // Handle category checkbox change
  const handleCategoryCheck = (e) => {
    const categoryId = Number(e.target.value);
    setSelectedCategories((prev) =>
      e.target.checked
        ? [...prev, categoryId]
        : prev.filter((id) => id !== categoryId)
    );
  };

  // Handle skill checkbox change
  const handleSkillCheck = (e) => {
    const skillId = Number(e.target.value);
    setSelectedSkills((prev) =>
      e.target.checked
        ? [...prev, skillId]
        : prev.filter((id) => id !== skillId)
    );
  };
  const handleTypeCheck = (e) => {
    setSelectedType((selectedType) =>
      e.target.checked ? e.target.value : null
    );
  };
  // Filter job postings based on selected skills & categories
  const filteredData = data?.pages.flatMap((page) =>
    page?.jobs?.filter((job) => {
      const matchesSkills =
        selectedSkills.length === 0 ||
        job.Skills.some((skill) => selectedSkills.includes(skill.skill_id));

      const matchesCategories =
        selectedCategories.length === 0 ||
        job.Categories.some((category) =>
          selectedCategories.includes(category.category_id)
        );
      const matchedType = !selectedType || job.job_type == selectedType;
      return matchesSkills && matchesCategories && matchedType;
    })
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading gigs!</div>;

  return (
    <div className={styles.container}>
      {/* Top Section: Filter Button, Search Bar */}
      <div className={styles.topSection}>
        <button className={styles.filterButton} onClick={toggleFilters}>
          &#x25BC; Filter
        </button>
        <input
          type="text"
          placeholder="Search jobs..."
          className={styles.searchBar}
        />
        <button className={styles.searchButton}>Search</button>
      </div>

      <hr className={styles.divider} />

      <div className={styles.mainContent}>
        {/* Sidebar (Filters) */}
        <div className={`${styles.sidebar} ${showFilters ? styles.show : ""}`}>
          <h5>Categories</h5>
          <ul>
            {categories?.map((category) => (
              <li key={category.category_id}>
                <input
                  type="checkbox"
                  value={category.category_id}
                  onChange={handleCategoryCheck}
                />{" "}
                {category.category_name}
              </li>
            ))}
          </ul>

          <h5>Skills</h5>
          <ul>
            {skills?.map((skill) => (
              <li key={skill.skill_id}>
                <input
                  type="checkbox"
                  value={skill.skill_id}
                  onChange={handleSkillCheck}
                />{" "}
                {skill.skill_name}
              </li>
            ))}
          </ul>

          <h5>Job Type</h5>
          <ul>
            <li>
              <input
                type="checkbox"
                name="JobType"
                value="Full-Time"
                onChange={handleTypeCheck}
              />{" "}
              Full Time
            </li>
            <li>
              <input
                type="checkbox"
                name="JobType"
                value="Part-Time"
                onChange={handleTypeCheck}
              />{" "}
              Part Time
            </li>
            <li>
              <input
                type="checkbox"
                name="JobType"
                value="Freelance"
                onChange={handleTypeCheck}
              />{" "}
              Freelance
            </li>
            <li>
              <input
                type="checkbox"
                name="JobType"
                value="Contract"
                onChange={handleTypeCheck}
              />{" "}
              Contract
            </li>
          </ul>
        </div>

        {/* Job Listings */}
        <div className={styles.jobsContainer}>
          {filteredData?.length > 0 ? (
            filteredData.map((job, index) => (
              <div
                className={styles.jobCard}
                key={index}
                onClick={(e) => {
                  setSelectedJob((selectedJob) => job);
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
                </p>
              </div>
            ))
          ) : (
            <div>No jobs match your filters.</div>
          )}
        </div>
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className={styles.loadMore}>
          <button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? "LOADING..." : "SHOW MORE"}
          </button>
        </div>
      )}
      <Pop job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
};

export default JobPostings;
