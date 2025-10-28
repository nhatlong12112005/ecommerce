// src/pages/admin/InvoiceManagement/InvoiceTemplate.jsx

import React from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

// Dùng React.forwardRef để component có thể nhận ref từ bên ngoài
export const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
  if (!invoice) {
    return null;
  }

  return (
    <Box ref={ref} sx={{ p: 4, color: "black" }}>
      <Typography variant="h4" gutterBottom align="center">
        HÓA ĐƠN BÁN HÀNG
      </Typography>
      <Typography align="center">Mã hóa đơn: {invoice._id}</Typography>
      <Typography align="center" gutterBottom>
        Ngày tạo: {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Thông tin khách hàng</Typography>
      <Typography>
        <b>Tên khách hàng:</b> {invoice.customerName}
      </Typography>
      <Typography>
        <b>Số điện thoại:</b> {invoice.shippingPhone}
      </Typography>
      <Typography>
        <b>Địa chỉ:</b> {invoice.shippingAddress}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Chi tiết sản phẩm
      </Typography>
      {invoice.items.map((item) => (
        <Grid container key={item.productId} sx={{ my: 1 }}>
          <Grid xs={8}>
            <Typography>
              {item.quantity} x {item.name}
            </Typography>
          </Grid>
          <Grid xs={4} sx={{ textAlign: "right" }}>
            <Typography>
              {formatCurrency(item.price * item.quantity)}
            </Typography>
          </Grid>
        </Grid>
      ))}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Tổng cộng:
        </Typography>
        <Typography variant="h6" color="primary">
          {formatCurrency(invoice.totalAmount)}
        </Typography>
      </Box>

      <Typography align="center" sx={{ mt: 4 }}>
        Cảm ơn quý khách đã mua hàng!
      </Typography>
    </Box>
  );
});
