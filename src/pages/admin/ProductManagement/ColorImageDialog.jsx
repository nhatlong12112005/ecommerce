import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  Avatar,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000";

export default function ColorImageDialog({
  open,
  onClose,
  productId,
  detailColor,
  onSuccess,
}) {
  const [formColor, setFormColor] = useState({ color: "", imageFiles: [] });
  const [previewImageUrls, setPreviewImageUrls] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef();
  const isEditMode = detailColor && detailColor.id;
  const isFormInvalid = !formColor.color;

  useEffect(() => {
    if (detailColor && open) {
      setFormColor({
        color: detailColor.color,
        imageUrls: detailColor.imageUrls || [],
        imageFiles: [],
      });
    } else {
      setFormColor({ color: "", imageFiles: [] });
    }
    setPreviewImageUrls([]);
  }, [detailColor, open]);

  const handleClose = () => {
    onClose();
    setFormColor({ color: "", imageFiles: [] });
    setPreviewImageUrls([]);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "color") {
      setFormColor((prev) => ({ ...prev, color: value }));
    } else if (files) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImageUrls((prev) => [...prev, ...newPreviews]);
      setFormColor((prev) => ({
        ...prev,
        imageFiles: [...(prev.imageFiles || []), ...files],
      }));
    }
  };

  const removeNewImage = (index) => {
    setPreviewImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFormColor((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formColor.color) {
      alert("Tên màu không được để trống!");
      return;
    }
    if (!productId) {
      alert("ProductId không hợp lệ!");
      return;
    }

    setIsSaving(true);
    try {
      // 1️⃣ Gọi API tạo màu mới
      const createRes = await axios.post(`${BACKEND_URL}/product-color`, {
        color: formColor.color,
        productId: productId,
      });

      const newColor = createRes.data;
      console.log("✅ Đã tạo màu:", newColor);

      // 2️⃣ Nếu có ảnh, upload ngay sau khi có id
      if (formColor.imageFiles && formColor.imageFiles.length > 0) {
        const formData = new FormData();
        formColor.imageFiles.forEach((file) => {
          formData.append("files", file);
        });

        const uploadRes = await axios.post(
          `${BACKEND_URL}/product-color/${newColor.id}/upload-images`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("✅ Upload ảnh thành công:", uploadRes.data);
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("❌ Lỗi khi lưu màu:", error.response?.data || error);
      alert("Lỗi khi tạo màu hoặc upload ảnh!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {isEditMode ? "Cập nhật Màu" : "Thêm Màu Mới"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 1 }}>
          <TextField
            label="Tên Màu sắc"
            name="color"
            value={formColor.color}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            style={{ display: "none" }}
            accept="image/*"
            multiple
          />

          <Typography variant="subtitle2">Hình ảnh mới</Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              minHeight: 100,
            }}
          >
            {previewImageUrls.map((url, index) => (
              <Box key={`new-${index}`} sx={{ position: "relative" }}>
                <Avatar
                  variant="rounded"
                  sx={{ width: 80, height: 80 }}
                  src={url}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    background: "white",
                  }}
                  onClick={() => removeNewImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Avatar
              variant="rounded"
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <PhotoCameraIcon />
            </Avatar>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSaving}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving || isFormInvalid}
        >
          {isSaving ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Lưu Màu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
