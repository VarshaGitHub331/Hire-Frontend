import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getClientOrders } from "../../apis/Order";
import DataTable from "react-data-table-component";
import styles from "./MyOrder.module.css";
import { useState } from "react";

const OrderTable = () => {
  const { user_id, role } = useAuthContext().userState;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const columns = [
    { name: "Order Id", selector: (row) => row.order_id },
    {
      name: `${role == "client" ? "Freelancer" : "Client"}`,
      selector: (row) => row.other_name,
    },
    { name: "Status", selector: (row) => row.status },
    { name: "Duration", selector: (row) => row.duration },
    {
      name: "Created On",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(), // Format date
    },
  ];
  function changePage(newPage) {
    setPage((page) => newPage);
  }
  function changeLimit(newLimit) {
    setLimit((limit) => newLimit);
  }
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getClientOrders(role, user_id),
    queryKey: ["orders", user_id],
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <div className={styles.titlePart}>
        <div className={styles.direction}>HIRE &gt; ORDERS &gt;&gt;</div>
      </div>
      {isLoading ? (
        <div>Loading...</div> // You can replace with a spinner if desired
      ) : (
        <DataTable
          className={styles.myOrderTable}
          highlightOnHover
          pointerOnHover
          pagination
          paginationPage={page}
          paginationPerPage={limit}
          onChangePage={changePage}
          onChangeRowsPerPage={changeLimit}
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "rgb(155, 214, 155)" /* Inline header color */,
                fontWeight: "bold",
                color: "#374151",
                padding: "1rem",
                textAlign: "center",
                fontSize: "0.8rem",
              },
            },
            cells: {
              style: {
                padding: "1rem",
                fontSize: "1rem",
                borderBottom: "1px solid #e5e7eb",
                textAlign: "center",
              },
            },
            pagination: {
              style: {
                width: "100%",
                padding: "1rem",

                textAlign: "center",
              },
            },
          }}
          columns={columns}
          data={orders || []}
        />
      )}
    </>
  );
};

export default OrderTable;
