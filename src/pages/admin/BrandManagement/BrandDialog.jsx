import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { addBrand, updateBrand } from "../../../services/brand-managment";
import { toast } from "react-toastify";

export default function BrandDialog({ open, onClose, onSuccess, detailBrand }) {
  const [formBrand, setFormBrand] = useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // Đổi tên state cho đúng nghĩa

  const handleClose = () => {
    onClose();
    setFormBrand({ name: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormBrand((prev) => ({ ...prev, [name]: value }));
  };

  // --- LOGIC SAVE (Không còn xử lý ảnh) ---
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Chỉ gửi mỗi tên thôi
      const payload = {
        name: formBrand.name,
      };

      if (detailBrand && detailBrand.id) {
        // Sửa
        const res = await updateBrand(detailBrand.id, payload);
        if (res.status === 200) {
          toast.success("Cập nhật thương hiệu thành công!");
          onSuccess();
          handleClose();
        }
      } else {
        // Thêm mới
        const res = await addBrand(payload);
        if (res.status === 201 || res.status === 200) {
          toast.success("Thêm thương hiệu mới thành công!");
          onSuccess();
          handleClose();
        }
      }
    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const msg = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;

        if (error.response.status === 400) {
          toast.warning(msg);
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Có lỗi xảy ra khi lưu.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (detailBrand && open) {
      setFormBrand({ name: detailBrand.name });
    } else {
      setFormBrand({ name: "" });
    }
  }, [detailBrand, open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {detailBrand && detailBrand.id
          ? "Chỉnh sửa thương hiệu"
          : "Thêm thương hiệu mới"}
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
        <div className="flex flex-col gap-4 pt-2">
          <TextField
            label="Tên thương hiệu"
            name="name"
            value={formBrand.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={isSubmitting}
            autoFocus
          />

          {/* ĐÃ XÓA PHẦN UPLOAD ẢNH Ở ĐÂY */}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formBrand.name || isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
