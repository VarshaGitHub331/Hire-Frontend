import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { getMyProposals } from "../../apis/Applicants";
import styles from "./MyProposals.module.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
const MyProposals = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { userState } = useAuthContext();
  const user_id = userState.user_id;
  const job_id = location?.state?.job_id;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["applicants", job_id, page, pageSize],
    queryFn: () => getMyProposals(user_id, page, pageSize),
    keepPreviousData: true,
  });

  const columns = [
    {
      name: "Proposal ID",
      selector: (row) => row.bidId,
      sortable: true,
    },
    {
      name: "Job ID",
      selector: (row) => row.Job_Posting.job_id,
      sortable: true,
    },
    {
      name: "Job Title",
      selector: (row) => row.Job_Posting.title,
    },
    { name: "Bid Status", selector: (row) => row.bid_status },
    {
      name: "Estimated Time (Days)",
      selector: (row) => row.estimated_time || "N/A",
    },
  ];

  if (isError) return <div>Error fetching applicants</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          HIRE &gt;{" "}
          <Link to="/freelancerJobs" style={{ curosr: "pointer" }}>
            JOBS
          </Link>{" "}
          &gt;&gt; PROPOSALS
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data || []}
            highlightOnHover
            pointerOnHover
            pagination
            paginationServer
            paginationTotalRows={data?.total}
            paginationPerPage={pageSize}
            paginationDefaultPage={page}
            onChangePage={(newPage) => setPage(newPage)}
            onChangeRowsPerPage={(newSize) => setPageSize(newSize)}
            customStyles={{
              table: {
                style: { width: "90%", margin: "0 auto" },
              },
              headCells: {
                style: {
                  backgroundColor: "rgb(155, 214, 155)",
                  color: "#fff",
                  padding: "12px",
                  fontSize: "14px",
                },
              },
              cells: {
                style: { padding: "12px", fontSize: "14px" },
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default MyProposals;
