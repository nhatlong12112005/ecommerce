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
  { value: "CANCELLED", label: "Đã hủy" }, // Vẫn giữ ở đây để tham chiếu
];

// 1. 👈 THÊM: Định nghĩa "trọng số" cho quy trình
// Đảm bảo không thể quay lại trạng thái có trọng số thấp hơn
const statusWeights = {
  PENDING: 1,
  SHIPPED: 2,
  COMPLETED: 3,
  CANCELLED: 4, // Trạng thái cuối
};

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
      onUpdate({ ...currentOrder, status: "CANCELLED" });
      onClose();
    }
  };

  if (!currentOrder) return null;

  // 2. 👈 THÊM: Lấy trọng số của trạng thái HIỆN TẠI
  const currentStatusWeight = statusWeights[currentOrder.status];

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
          {/* (Thông tin khách hàng - Giữ nguyên) */}
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
          </Grid>

          {/* (Cập nhật & Giao hàng - Giữ nguyên) */}
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
                value={currentOrder.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                // 3. 👈 SỬA: Vô hiệu hóa toàn bộ nếu là trạng thái cuối
                disabled={
                  currentOrder.status === "CANCELLED" ||
                  currentOrder.status === "COMPLETED"
                }
              >
                {/* 4. 👈 SỬA: Cập nhật logic map */}
                {statusOptions.map((option) => {
                  const optionWeight = statusWeights[option.value];

                  // Logic vô hiệu hóa từng lựa chọn
                  let isOptionDisabled = false;

                  // A. Không cho quay lùi (ví dụ: SHIPPED (2) -> PENDING (1))
                  if (optionWeight < currentStatusWeight) {
                    isOptionDisabled = true;
                  }

                  // B. Không cho chọn "Đã hủy" từ dropdown (phải dùng nút)
                  if (option.value === "CANCELLED") {
                    isOptionDisabled = true;
                  }

                  return (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      // Áp dụng logic disable
                      disabled={isOptionDisabled}
                    >
                      {option.label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
          </Grid>

          {/* (Grid Divider - Giữ nguyên) */}
          <Grid item xs={12}>
            {" "}
            <Divider />{" "}
          </Grid>

          {/* (Danh sách sản phẩm - Giữ nguyên) */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm trong đơn hàng
            </Typography>

            {currentOrder.details.map((item) => {
              const variant = item.productVariant;
              const color = variant?.productColor;
              const product = color?.product;
              const productName = product?.name || "Sản phẩm không xác định";
              const imageUrl = color?.imageUrls?.[0] || "/placeholder.jpg";

              return (
                <div key={item.id} className="flex items-center gap-4 py-2">
                  <img
                    src={`${BACKEND_URL}${imageUrl}`}
                    alt={productName}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <Typography className="font-medium">
                      {productName}
                    </Typography>
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

      {/* (Dialog Actions - Giữ nguyên) */}
      <DialogActions
        sx={{ justifyContent: "space-between", padding: "16px 24px" }}
      >
        <Button
          onClick={handleCancelOrder}
          variant="outlined"
          color="error"
          disabled={
            currentOrder.status === "CANCELLED" ||
            currentOrder.status === "COMPLETED"
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
