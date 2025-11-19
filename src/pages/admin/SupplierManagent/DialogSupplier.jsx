import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createSupplier, updateSupplier } from "../../../services/supplier";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  email: "",
  phone: "",
};

export default function SupplierDialog({
  open,
  onClose,
  onSuccess,
  detailSupplier,
}) {
  const [formSupplier, setFormSupplier] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    onClose();
    setFormSupplier(initialState);
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (detailSupplier && detailSupplier.id) {
        // --- CẬP NHẬT ---
        await updateSupplier(detailSupplier.id, formSupplier);
        toast.success("Cập nhật nhà cung cấp thành công!");
      } else {
        // --- THÊM MỚI ---
        await createSupplier(formSupplier);
        toast.success("Thêm nhà cung cấp thành công!");
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);

      // --- BẮT LỖI TỪ BACKEND (QUAN TRỌNG) ---
      if (err.response && err.response.data && err.response.data.message) {
        const msg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;

        if (err.response.status === 400) {
          toast.warning(msg); // Lỗi trùng tên/thùng rác dùng warning
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (detailSupplier && open) {
      setFormSupplier({
        name: detailSupplier.name || "",
        email: detailSupplier.email || "",
        phone: detailSupplier.phone || "",
      });
    } else {
      setFormSupplier(initialState);
    }
  }, [detailSupplier, open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {detailSupplier && detailSupplier.id
          ? "Sửa nhà cung cấp"
          : "Thêm nhà cung cấp"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          disabled={isSubmitting}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ paddingTop: "8px" }}>
          <TextField
            label="Tên nhà cung cấp"
            name="name"
            value={formSupplier.name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
            disabled={isSubmitting}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formSupplier.email}
            onChange={handleChange}
            fullWidth
            disabled={isSubmitting}
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={formSupplier.phone}
            onChange={handleChange}
            fullWidth
            required
            disabled={isSubmitting}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formSupplier.name || !formSupplier.phone || isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
