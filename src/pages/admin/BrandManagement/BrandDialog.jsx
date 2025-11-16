import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  CircularProgress, // Thêm để báo loading
  Box, // Thêm để layout
  Typography, // Thêm để báo lỗi
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera"; // Icon upload
import { addBrand, updateBrand } from "../../../services/brand-managment";
import { uploadImage } from "../../../services/upload"; // Import hàm upload mới

export default function BrandDialog({ open, onClose, onSuccess, detailBrand }) {
  const [formBrand, setFormBrand] = useState({ name: "" });
  const [selectedFile, setSelectedFile] = useState(null); // State cho file người dùng chọn
  const [preview, setPreview] = useState(null); // State cho ảnh xem trước
  const [isUploading, setIsUploading] = useState(false); // State báo đang upload/lưu
  const [error, setError] = useState(null); // State báo lỗi

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo link xem trước (local)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset tất cả state
    setFormBrand({ name: "" });
    setSelectedFile(null);
    setPreview(null);
    setIsUploading(false);
    setError(null);
  };

  // Xử lý nhập tên
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormBrand((prev) => ({ ...prev, [name]: value }));
  };

  // Logic LƯU (quan trọng)
  const handleSave = async () => {
    setError(null);
    setIsUploading(true);

    try {
      // Lấy URL logo cũ (nếu là chỉnh sửa)
      let logoUrl = detailBrand ? detailBrand.logoUrl : null;

      // 1. Nếu có file mới, upload nó lên Cloudinary
      if (selectedFile) {
        logoUrl = await uploadImage(selectedFile);
      }

      // 2. Tạo payload để lưu vào database (chứa name và logoUrl)
      const payload = {
        name: formBrand.name,
        logoUrl: logoUrl, // Dùng URL mới (nếu có) hoặc URL cũ
      };

      // 3. Gọi API add/update brand như cũ (gửi JSON)
      if (detailBrand && detailBrand.id) {
        const res = await updateBrand(detailBrand.id, payload);
        if (res.status === 200) {
          onSuccess();
          handleClose();
        }
      } else {
        const res = await addBrand(payload);
        if (res.status === 201) {
          onSuccess();
          handleClose();
        }
      }
    } catch (error) {
      console.error(error);
      setError("Lưu thất bại. Có thể do upload ảnh hoặc server lỗi.");
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
      }
    } finally {
      setIsUploading(false); // Luôn tắt loading
    }
  };

  // Cập nhật form khi mở dialog
  useEffect(() => {
    if (detailBrand && open) {
      // Chế độ: Chỉnh sửa
      setFormBrand({ name: detailBrand.name });
      setPreview(detailBrand.logoUrl || null); // Hiển thị logo cũ
    } else {
      // Chế độ: Thêm mới
      setFormBrand({ name: "" });
      setPreview(null);
    }
    // Reset các state khác
    setSelectedFile(null);
    setError(null);
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
          disabled={isUploading}
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
            disabled={isUploading} // Khóa khi đang upload
          />

          {/* Nút Upload ảnh */}
          <Box sx={{ border: "1px dashed grey", p: 2, borderRadius: 1 }}>
            <Button
              variant="contained"
              component="label" // Cho phép button hoạt động như 1 <label>
              startIcon={<PhotoCamera />}
              disabled={isUploading}
            >
              Chọn ảnh logo
              <input
                type="file"
                hidden
                accept="image/*" // Chỉ chấp nhận file ảnh
                onChange={handleFileChange}
              />
            </Button>
            {preview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="caption">Xem trước:</Typography>
                <img
                  src={preview}
                  alt="Xem trước logo"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginTop: "8px",
                  }}
                />
              </Box>
            )}
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <Typography variant="body2" color="error" sx={{ mr: "auto", ml: 2 }}>
            {error}
          </Typography>
        )}
        <Button onClick={handleClose} disabled={isUploading}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formBrand.name || isUploading}
        >
          {isUploading ? <CircularProgress size={24} /> : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
