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
        const res = await updateCategories(detailCategory.id, formCategory);
        if (res.status === 200) {
          onSuccess();
          handleClose();
        }
      } else {
        const res = await addCategory(formCategory);
        if (res.status === 201) {
          onSuccess();
          handleClose();
        }
      }
    } catch (err) {
      console.error(err);
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formCategory.name}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
