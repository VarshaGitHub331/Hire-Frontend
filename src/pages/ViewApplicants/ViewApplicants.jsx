import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getApplicantsForJob } from "../../apis/Applicants";
import styles from "./ViewApplicants.module.css";
import ApplicantModal from "./ProposalPopUp";
import ApplicantProfile from "./Applicant";
import { useAuthContext } from "../../contexts/AuthContext";
const ViewApplicants = () => {
  const navigate = useNavigate();
  const { userState } = useAuthContext();
  const { token } = userState;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const location = useLocation();
  const job_id = location?.state?.job_id;
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [profileApplicant, setProfileApplicant] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["applicants", job_id, page, pageSize],
    queryFn: () => getApplicantsForJob(job_id, page, pageSize, token),
    keepPreviousData: true,
  });

  const columns = [
    {
      name: "Applicant ID",
      selector: (row) => row.applicant_id,
      sortable: true,
    },
    {
      name: "Freelancer Name",
      selector: (row) => (
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setProfileApplicant(row);
          }}
        >
          {row.Freelancer.User.first_name}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Bid Amount",
      selector: (row) => row.Bids[0]?.bid_amount || "N/A",
      sortable: true,
    },
    { name: "Bid Status", selector: (row) => row.Bids[0]?.bid_status || "N/A" },
    {
      name: "Estimated Time (Days)",
      selector: (row) => row.Bids[0]?.estimated_time || "N/A",
    },
  ];

  if (isError) return <div>Error fetching applicants</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          HIRE &gt; JOBS &gt;&gt;APPLICANTS
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
            onRowClicked={(row) => setSelectedApplicant(row)}
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

          {selectedApplicant && (
            <ApplicantModal
              applicant={selectedApplicant}
              onClose={() => setSelectedApplicant(null)}
            />
          )}
          {profileApplicant && (
            <ApplicantProfile
              applicant={profileApplicant}
              onClose={() => {
                setProfileApplicant(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ViewApplicants;
