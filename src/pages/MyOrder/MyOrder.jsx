import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContext";

const OrderTable = () => {
  const { user_id } = useAuthContext().userState;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Freelancer Name</TableCell>
            <TableCell>Package</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.freelancerName}</TableCell>
              <TableCell>{order.package}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <button onClick={() => handleAccept(order.id)}>Accept</button>
                <button onClick={() => handleReject(order.id)}>Reject</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
