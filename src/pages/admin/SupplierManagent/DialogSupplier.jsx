import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Stack, // Thêm Stack để xếp layout
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createSupplier, updateSupplier } from "../../../services/supplier";
import { toast } from "react-toastify"; // Thêm toast để thông báo

// Trạng thái khởi tạo cho form
const initialState = {
  name: "",
  email: "",
  phone: "",
};

export default function SupplierDialog({
  open,
  onClose,
  onSuccess,
  detailSupplier, // <-- SỬA: Đổi tên prop từ `detailCategory` sang `detailSupplier`
}) {
  const [formSupplier, setFormSupplier] = useState(initialState);

  const handleClose = () => {
    onClose();
    setFormSupplier(initialState); // <-- SỬA: Reset tất cả các trường
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (detailSupplier && detailSupplier.id) {
        // --- Chế độ CẬP NHẬT ---
        await updateSupplier(detailSupplier.id, formSupplier);
        toast.success("Cập nhật nhà cung cấp thành công!");
      } else {
        // --- Chế độ THÊM MỚI ---
        await createSupplier(formSupplier);
        toast.success("Thêm nhà cung cấp thành công!");
      }
      onSuccess(); // Gọi lại hàm onSuccess để tải lại dữ liệu
      handleClose(); // Đóng dialog
    } catch (err) {
      console.error(err);
      // Hiển thị lỗi từ server (nếu có)
      const errorMessage =
        err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  // SỬA: Cập nhật useEffect để điền TẤT CẢ dữ liệu khi ở chế độ "Sửa"
  useEffect(() => {
    if (detailSupplier && open) {
      // Chế độ Sửa: Lấy dữ liệu từ prop
      setFormSupplier({
        name: detailSupplier.name || "",
        email: detailSupplier.email || "",
        phone: detailSupplier.phone || "",
      });
    } else {
      // Chế độ Thêm: Reset về trạng thái rỗng
      setFormSupplier(initialState);
    }
  }, [detailSupplier, open]); // <-- SỬA: phụ thuộc vào `detailSupplier`

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* SỬA: Tiêu đề */}
      <DialogTitle>
        {detailSupplier && detailSupplier.id
          ? "Sửa nhà cung cấp"
          : "Thêm nhà cung cấp"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* SỬA: Thêm các trường email và phone */}
      <DialogContent dividers>
        <Stack spacing={2} sx={{ paddingTop: "8px" }}>
          <TextField
            label="Tên nhà cung cấp"
            name="name"
            value={formSupplier.name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus // Tự động focus vào trường này
          />
          <TextField
            label="Email"
            name="email"
            type="email" // Đặt type là email để có validation cơ bản
            value={formSupplier.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={formSupplier.phone}
            onChange={handleChange}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          // SỬA: Thêm validation cơ bản (yêu cầu Tên và SĐT)
          disabled={!formSupplier.name || !formSupplier.phone}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
