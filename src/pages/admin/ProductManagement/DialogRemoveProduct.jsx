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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

// State ban đầu cho form sản phẩm
const initialState = {
  name: "",
  price: "",
  quantity: "",
  category: "",
  description: "",
  images: [], // ✅ Thêm trường images
};

export default function ProductDialog({ open, onClose, onSave, product }) {
  const [formData, setFormData] = useState(initialState);
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(initialState);
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Xử lý chọn nhiều file ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
    }));
  };

  // ✅ Xử lý xóa ảnh khỏi danh sách
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {" "}
      {/* Tăng maxWidth để có chỗ cho ảnh */}
      <DialogTitle>
        {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
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
            label="Tên sản phẩm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Giá"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Số lượng"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Danh mục"
            name="category"
            value={formData.category}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="Điện thoại">Điện thoại</MenuItem>
            <MenuItem value="Laptop">Laptop</MenuItem>
            <MenuItem value="Phụ kiện">Phụ kiện</MenuItem>
            <MenuItem value="Máy tính bảng">Máy tính bảng</MenuItem>
          </TextField>
          <TextField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />

          {/* ✅ Phần quản lý hình ảnh */}
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Hình ảnh sản phẩm
            </Typography>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddPhotoAlternateIcon />}
              >
                Chọn ảnh
              </Button>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 border rounded overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Product ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
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
