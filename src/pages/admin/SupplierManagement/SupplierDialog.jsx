import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// State ban đầu cho form
const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function SupplierDialog({ open, onClose, onSave, supplier }) {
  const [formData, setFormData] = useState(initialState);
  const isEditing = !!supplier; // Xác định là đang sửa hay thêm mới

  // useEffect để điền dữ liệu vào form khi sửa
  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData(initialState);
    }
  }, [supplier, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose(); // Tự động đóng dialog sau khi lưu
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="flex flex-col gap-4 pt-2">
          <TextField
            label="Tên nhà cung cấp"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formData.name}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
