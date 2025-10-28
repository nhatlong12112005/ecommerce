import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

export default function SalesDetailDialog({ open, onClose, product }) {
  // Tránh lỗi khi product chưa có dữ liệu
  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Lịch sử bán hàng: {product.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Ngày bán</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Số lượng
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.salesHistory.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell>{dayjs(sale.date).format("DD/MM/YYYY")}</TableCell>
                  <TableCell align="right">{sale.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
