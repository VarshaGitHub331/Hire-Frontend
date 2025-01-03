import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientOrders } from "../../apis/Order"; // Assuming you have an update API
import DataTable from "react-data-table-component";
import styles from "./MyOrder.module.css";
import { FaEdit } from "react-icons/fa"; // Edit icon from react-icon
import { Popover } from "react-bootstrap";
import { ChangeOrderStatus } from "../../apis/Order";
import { useNavigate } from "react-router-dom";

const OrderTable = () => {
  const queryClient = useQueryClient();
  const { user_id, role } = useAuthContext().userState;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [pop, setPop] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [editingId, setEditingId] = useState("");
  const navigate = useNavigate();
  const columns = [
    { name: "Order Id", selector: (row) => row.order_id },
    {
      name: `${role === "client" ? "Freelancer" : "Client"}`,
      selector: (row) => row.other_name,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <div>
          <span
            data-tip={`Current status: ${row.status}`}
            style={{ cursor: "pointer" }}
          >
            {row.status}
          </span>
          <FaEdit
            style={{ color: "rgb(155, 214, 155)", marginLeft: "1rem" }}
            onClick={(e) =>
              setEditingId((editingId) =>
                editingId == row.order_id ? "" : row.order_id
              )
            }
          />
          {editingId === row.order_id && (
            <Popover className={styles.popUp}>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                onBlur={() => handleStatusChange(row.order_id, newStatus)} // Call onBlur or similar
              >
                {role == "freelancer" && (
                  <option value="accepted">Accepted</option>
                )}
                {role == "freelancer" && (
                  <option value="progress">In Progress</option>
                )}
                <option value="complete">Completed</option>
              </select>
            </Popover>
          )}
        </div>
      ),
    },
    { name: "Duration", selector: (row) => row.duration },
    { name: "Payable", selector: (row) => row.payable },
    {
      name: "Created On",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(), // Format date
    },
  ];
  const { mutate: orderUpdate } = useMutation({
    mutationFn: ({ orderId, status }) => ChangeOrderStatus(orderId, status),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries(["orders", user_id]);
    },
    onError: () => {
      console.log("Error occured in updating");
    },
  });
  // Change page handler
  function changePage(newPage) {
    setPage(newPage);
  }

  // Change rows per page handler
  function changeLimit(newLimit) {
    setLimit(newLimit);
  }
  function handleStatusChange() {
    orderUpdate({ orderId: editingId, status: newStatus });
    setEditingId("");
  }
  // Fetch orders using react-query
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getClientOrders(role, user_id),
    queryKey: ["orders", user_id],
  });

  // Handle clicking on status to start editing

  // Display loading or error message if necessary
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
          onRowClicked={(row) => {
            navigate(`/order/${row.order_id}`);
          }}
          customStyles={{
            table: {
              style: {
                width: "90%",
                margin: "0 auto",
              },
            },
            headCells: {
              style: {
                backgroundColor: "rgb(155, 214, 155)", // Inline header color
                fontWeight: "bold",
                color: "#374151",
                padding: "1rem",
                textAlign: "center",
                textWrap: "wrap",
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
