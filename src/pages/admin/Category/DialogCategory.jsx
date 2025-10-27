import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, TextField } from "@mui/material";
import { toSlug } from "../../../libs/utils/toSlug";

// ✅ Giao diện BootstrapDialog (từ MUI)
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function DialogCategory({ open, onClose, onSuccess }) {
  const [formCategory, setFormCategory] = React.useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // ✅ Đóng dialog + reset form
  const handleClose = () => {
    onClose();
    setFormCategory({
      name: "",
      description: "",
    });
  };

  // ✅ Khi gõ input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Thêm danh mục (mock)
  const handleAddCategory = () => {
    setIsLoading(true);

    const newCategory = {
      ...formCategory,
      slug: toSlug(formCategory.name),
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Giả lập delay 1 giây
    setTimeout(() => {
      console.log("✨ Danh mục mới được thêm:", newCategory);
      setIsLoading(false);
      onSuccess(newCategory); // callback để cập nhật danh sách ngoài
      handleClose();
    }, 1000);
  };

  return (
    <React.Fragment>
      <BootstrapDialog aria-labelledby="dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title">
          Thêm danh mục
        </DialogTitle>

        {/* Nút đóng */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        {/* Form nhập */}
        <DialogContent dividers>
          <div className="flex flex-col gap-3 w-96">
            <TextField
              fullWidth
              label="Tên danh mục"
              name="name"
              value={formCategory.name}
              onChange={handleChange}
              required
            />
            <TextField
              disabled
              fullWidth
              label="Slug"
              name="slug"
              value={toSlug(formCategory.name)}
              required
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formCategory.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </div>
        </DialogContent>

        {/* Nút hành động */}
        <DialogActions>
          <Button sx={{ color: "gray" }} variant="text" onClick={handleClose}>
            Quay lại
          </Button>
          <Button
            disabled={isLoading}
            variant="contained"
            onClick={handleAddCategory}
          >
            {isLoading ? <CircularProgress size={20} /> : "Thêm"}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
