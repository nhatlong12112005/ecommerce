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
import dayjs from "dayjs";

const BACKEND_URL = "http://localhost:3000";

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const statusOptions = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "SHIPPED", label: "Đang Giao Hàng" },
  { value: "COMPLETED", label: "Hoàn thành" },
];

const statusWeights = {
  PENDING: 1,
  SHIPPED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

export default function OrderDetailsDialog({ open, onClose, onUpdate, order }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  useEffect(() => {
    if (order) {
      setCurrentOrder({ ...order });
      setTempStatus(order.status); // Load trạng thái tạm
    }
  }, [order, open]);

  if (!currentOrder) return null;

  // Lưu thay đổi trạng thái
  const handleSaveChanges = () => {
    onUpdate({
      ...currentOrder,
      status: tempStatus,
    });
    onClose();
  };

  // Chỉ cho hủy khi PENDING
  const handleCancelOrder = () => {
    if (currentOrder.status !== "PENDING") {
      alert("Chỉ có thể hủy đơn hàng khi đang ở trạng thái CHỜ XỬ LÝ");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      onUpdate({
        ...currentOrder,
        status: "CANCELLED",
      });
      onClose();
    }
  };

  const currentWeight = statusWeights[currentOrder.status];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chi tiết đơn hàng #{currentOrder.id.split("-")[0]}...
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
          {/* THÔNG TIN KHÁCH HÀNG */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Typography>
              <b>Tên:</b> {currentOrder.user?.name}
            </Typography>
            <Typography>
              <b>SĐT:</b> {currentOrder.user?.phone}
            </Typography>
            <Typography>
              <b>Địa chỉ giao hàng:</b> {currentOrder.user?.address}
            </Typography>
            <Typography>
              <b>Thanh toán:</b> Tiền mặt
            </Typography>
          </Grid>

          {/* CẬP NHẬT TRẠNG THÁI */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Cập nhật & Giao hàng
            </Typography>
            <Typography variant="body2" gutterBottom>
              <b>Ngày đặt:</b>{" "}
              {dayjs(currentOrder.orderDate).format("DD/MM/YYYY HH:mm")}
            </Typography>

            <div className="flex flex-col gap-4 mt-2">
              <TextField
                label="Trạng thái đơn hàng"
                select
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
                disabled={
                  currentOrder.status === "CANCELLED" ||
                  currentOrder.status === "COMPLETED"
                }
              >
                {statusOptions.map((option) => {
                  const optionWeight = statusWeights[option.value];
                  // Disable option nếu trọng số thấp hơn trạng thái hiện tại
                  const isDisabled =
                    optionWeight < currentWeight ||
                    option.value === "CANCELLED";
                  return (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      disabled={isDisabled}
                    >
                      {option.label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* DANH SÁCH SẢN PHẨM */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm trong đơn hàng
            </Typography>

            {currentOrder.details.map((item) => {
              const variant = item.productVariant;
              const color = variant?.productColor;
              const product = color?.product;
              const name = product?.name || "Không xác định";
              const image = color?.imageUrls?.[0] || "/placeholder.jpg";

              return (
                <div key={item.id} className="flex items-center gap-4 py-2">
                  <img
                    src={`${BACKEND_URL}${image}`}
                    alt={name}
                    className="w-16 h-16 object-cover rounded border"
                  />

                  <div className="flex-1">
                    <Typography className="font-medium">{name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số lượng: {item.quantity}
                    </Typography>
                  </div>

                  <Typography className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </div>
              );
            })}

            <Divider />
            <div className="flex justify-between items-center mt-2">
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="error">
                {formatPrice(currentOrder.totalAmount)}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      {/* ACTION BUTTONS */}
      <DialogActions
        sx={{ justifyContent: "space-between", padding: "16px 24px" }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancelOrder}
          disabled={currentOrder.status !== "PENDING"}
        >
          Hủy đơn hàng
        </Button>

        <div>
          <Button onClick={onClose}>Đóng</Button>
          <Button variant="contained" onClick={handleSaveChanges}>
            Lưu thay đổi
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
