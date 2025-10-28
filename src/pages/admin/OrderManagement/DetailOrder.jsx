import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function OrderDetailsDialog({ open, onClose, onUpdate, order }) {
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    if (order) {
      setCurrentOrder({ ...order });
    }
  }, [order, open]);

  const handleFieldChange = (field, value) => {
    setCurrentOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    onUpdate(currentOrder);
    onClose();
  };

  const handleCancelOrder = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
      )
    ) {
      onUpdate({ ...currentOrder, status: "Đã hủy" });
      onClose();
    }
  };

  if (!currentOrder) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chi tiết đơn hàng #{currentOrder._id}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Thông tin khách hàng */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Typography>
              <b>Tên:</b> {currentOrder.customerName}
            </Typography>
            <Typography>
              <b>SĐT:</b> {currentOrder.shippingPhone}
            </Typography>{" "}
            {/* Hiển thị SĐT */}
            <Typography>
              <b>Địa chỉ giao hàng:</b> {currentOrder.shippingAddress}
            </Typography>
          </Grid>

          {/* Cập nhật trạng thái & giao hàng */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Cập nhật & Giao hàng
            </Typography>
            <div className="flex flex-col gap-4">
              <TextField
                label="Trạng thái đơn hàng"
                select
                value={currentOrder.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                disabled={
                  currentOrder.status === "Đã hủy" ||
                  currentOrder.status === "Hoàn thành"
                }
              >
                <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                <MenuItem value="Đang giao">Đang giao</MenuItem>
                <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
              </TextField>
              <TextField
                label="Phân công giao hàng"
                value={currentOrder.shipper || ""}
                onChange={(e) => handleFieldChange("shipper", e.target.value)}
                placeholder="VD: Giao Hàng Nhanh, Viettel Post,..."
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Danh sách sản phẩm */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm trong đơn hàng
            </Typography>
            {currentOrder.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <Typography>
                  {item.quantity} x {item.name}
                </Typography>
                <Typography>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price * item.quantity)}
                </Typography>
              </div>
            ))}
            <Divider />
            <div className="flex justify-between items-center mt-2">
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(currentOrder.totalAmount)}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", padding: "16px 24px" }}
      >
        <Button
          onClick={handleCancelOrder}
          variant="outlined"
          color="error"
          disabled={
            currentOrder.status === "Đã hủy" ||
            currentOrder.status === "Hoàn thành"
          }
        >
          Hủy đơn hàng
        </Button>
        <div>
          <Button onClick={onClose}>Đóng</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Lưu thay đổi
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
