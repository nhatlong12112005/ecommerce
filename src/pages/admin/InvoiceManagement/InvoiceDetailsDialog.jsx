// src/pages/admin/InvoiceManagement/InvoiceDetailsDialog.jsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Hàm format tiền tệ
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

export default function InvoiceDetailsDialog({
  open,
  onClose,
  onUpdate,
  invoice,
}) {
  const [currentInvoice, setCurrentInvoice] = useState(null);

  useEffect(() => {
    if (invoice) {
      setCurrentInvoice({ ...invoice });
    }
  }, [invoice, open]);

  // Hàm xác nhận đã thanh toán
  const handleMarkAsPaid = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xác nhận hóa đơn này đã thanh toán?"
      )
    ) {
      const updatedInvoice = { ...currentInvoice, status: "Đã thanh toán" };
      onUpdate(updatedInvoice);
      onClose();
    }
  };

  if (!currentInvoice) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chi tiết hóa đơn #{currentInvoice._id}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Nội dung Dialog để xem trên web */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Thông tin khách hàng</Typography>
            <Typography>
              <b>Tên:</b> {currentInvoice.customerName}
            </Typography>
            <Typography>
              <b>SĐT:</b> {currentInvoice.shippingPhone}
            </Typography>
            <Typography>
              <b>Địa chỉ:</b> {currentInvoice.shippingAddress}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm trong hóa đơn
            </Typography>
            {currentInvoice.items.map((item) => (
              <Box
                key={item.productId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>
                  {item.quantity} x {item.name}
                </Typography>
                <Typography>
                  {formatCurrency(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="h6" sx={{ mr: 2 }}>
                Tổng cộng:
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(currentInvoice.totalAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      {/* ✅ Khu vực hành động đã được rút gọn */}
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose}>Đóng</Button>
        {currentInvoice.status === "Chưa thanh toán" && (
          <Button
            onClick={handleMarkAsPaid}
            variant="contained"
            color="success"
            sx={{ ml: 1 }}
          >
            Xác nhận đã thanh toán
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
