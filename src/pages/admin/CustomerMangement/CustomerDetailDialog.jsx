import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

export default function CustomerDetailDialog({ user, open, onClose }) {
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Chi tiết tài khoản: {user.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <strong>ID:</strong> {user._id}
        </Typography>
        <Typography gutterBottom>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography gutterBottom>
          <strong>Số điện thoại:</strong> {user.phone}
        </Typography>
        <Typography gutterBottom>
          <strong>Địa chỉ:</strong> {user.address}
        </Typography>
        <Typography gutterBottom>
          <strong>Ngày đăng ký:</strong>{" "}
          {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}
        </Typography>
        <Typography gutterBottom>
          <strong>Trạng thái:</strong>{" "}
          <span style={{ color: user.status === "active" ? "green" : "red" }}>
            {user.status === "active" ? "Đang hoạt động" : "Đã bị khóa"}
          </span>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Lịch sử đơn hàng</Typography>
        {user.orderHistory.length > 0 ? (
          user.orderHistory.map((order) => (
            <div key={order.id} style={{ marginTop: "10px" }}>
              <Typography>
                - Mã đơn: {order.id} ({dayjs(order.date).format("DD/MM/YYYY")})
                - Tổng tiền: {order.total.toLocaleString()}₫
              </Typography>
            </div>
          ))
        ) : (
          <Typography>Chưa có đơn hàng nào.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
