import React, { useEffect, useState } from "react";
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
import {
  addCategory,
  updateCategories,
} from "../../../services/category-management";

// 1. Import Toast
import { toast } from "react-toastify";

export default function CategoryDialog({
  open,
  onClose,
  onSuccess,
  detailCategory,
}) {
  const [formCategory, setFormCategory] = useState({ name: "" });

  const handleClose = () => {
    onClose();
    setFormCategory({ name: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (detailCategory && detailCategory.id) {
        // --- TRƯỜNG HỢP SỬA ---
        const res = await updateCategories(detailCategory.id, formCategory);
        if (res.status === 200) {
          toast.success("Cập nhật danh mục thành công!"); // ✅
          onSuccess();
          handleClose();
        }
      } else {
        // --- TRƯỜNG HỢP THÊM ---
        const res = await addCategory(formCategory);
        if (res.status === 201 || res.status === 200) {
          toast.success("Thêm danh mục mới thành công!"); // ✅
          onSuccess();
          handleClose();
        }
      }
    } catch (err) {
      console.error(err);

      // --- XỬ LÝ LỖI THÔNG MINH ---
      // Nếu Backend trả về message lỗi (ví dụ: Trùng tên, Đã có trong thùng rác...)
      if (err.response && err.response.data && err.response.data.message) {
        // Nếu message là mảng (lỗi validation) thì lấy cái đầu tiên
        const message = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;

        toast.warning(message); // ⚠️ Dùng warning cho lỗi nghiệp vụ
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau."); // ❌ Lỗi hệ thống
      }
    }
  };

  useEffect(() => {
    if (detailCategory && open) {
      setFormCategory({ name: detailCategory.name });
    } else {
      setFormCategory({ name: "" });
    }
  }, [detailCategory, open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {detailCategory && detailCategory.id ? "Sửa danh mục" : "Thêm danh mục"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Tên danh mục"
          name="name"
          value={formCategory.name}
          onChange={handleChange}
          fullWidth
          required
          autoFocus // Tự động focus vào ô nhập khi mở popup
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formCategory.name.trim()} // Chặn nếu chỉ nhập khoảng trắng
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
