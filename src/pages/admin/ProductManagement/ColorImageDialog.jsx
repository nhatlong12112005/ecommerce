import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Avatar,
  Paper,
  CircularProgress,
  Typography, // ✅ Đã thêm Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { toast } from "react-toastify";

import {
  createColor,
  updateColorGroup,
  uploadColorImages,
} from "../../../services/product-management";

const BACKEND_URL = "http://localhost:3000";

export default function ColorImageDialog({
  open,
  onClose,
  productId,
  detailColor,
  onSuccess,
}) {
  const [formColor, setFormColor] = useState({
    color: "",
    imageUrls: [],
    imageFiles: [],
  });
  const [previewImageUrls, setPreviewImageUrls] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef();
  const isEditMode = detailColor && detailColor.id;

  useEffect(() => {
    if (detailColor && open) {
      setFormColor({
        color: detailColor.color,
        imageUrls: detailColor.imageUrls || [],
        imageFiles: [],
      });
      setPreviewImageUrls([]);
    } else {
      setFormColor({ color: "", imageUrls: [], imageFiles: [] });
      setPreviewImageUrls([]);
    }
  }, [detailColor, open]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormColor((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...files],
      }));

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewImageUrls((prev) => [...prev, ...newPreviews]);
    }
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setFormColor((prev) => {
      const newFiles = [...prev.imageFiles];
      newFiles.splice(index, 1);
      return { ...prev, imageFiles: newFiles };
    });
    setPreviewImageUrls((prev) => {
      const newUrls = [...prev];
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const handleSave = async () => {
    if (!formColor.color.trim()) return;
    setIsSaving(true);
    try {
      let colorGroupId = detailColor?.id;

      if (isEditMode) {
        await updateColorGroup(colorGroupId, { color: formColor.color });
      } else {
        const res = await createColor({
          productId: productId,
          color: formColor.color,
        });
        colorGroupId = res.data.id;
      }

      if (formColor.imageFiles.length > 0) {
        const formData = new FormData();
        formColor.imageFiles.forEach((file) => {
          formData.append("images", file);
        });
        await uploadColorImages(colorGroupId, formData);
      }

      toast.success(
        isEditMode ? "Cập nhật màu thành công!" : "Thêm màu mới thành công!"
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        const msg = error.response.data.message;
        toast.warning(Array.isArray(msg) ? msg[0] : msg);
      } else {
        toast.error("Có lỗi xảy ra khi lưu màu.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Cập nhật Màu Sắc" : "Thêm Màu Sắc Mới"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          disabled={isSaving}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Tên màu (Ví dụ: Đỏ, Xanh Dương...)"
          fullWidth
          value={formColor.color}
          onChange={(e) =>
            setFormColor((prev) => ({ ...prev, color: e.target.value }))
          }
          disabled={isSaving}
          required
        />

        <Box sx={{ mt: 3 }}>
          {/* Đã có Typography được import */}
          <Typography variant="subtitle2" gutterBottom>
            Hình ảnh sản phẩm:
          </Typography>

          <Paper
            variant="outlined"
            sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
          >
            {formColor.imageUrls.map((url, index) => (
              <Box key={`old-${index}`} sx={{ position: "relative" }}>
                <Avatar
                  variant="rounded"
                  sx={{ width: 80, height: 80 }}
                  src={`${BACKEND_URL}${url}`}
                />
              </Box>
            ))}

            {previewImageUrls.map((url, index) => (
              <Box key={`new-${index}`} sx={{ position: "relative" }}>
                <Avatar
                  variant="rounded"
                  sx={{ width: 80, height: 80, border: "2px solid #1976d2" }}
                  src={url}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    background: "white",
                    border: "1px solid #ddd",
                  }}
                  onClick={() => removeNewImage(index)}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            ))}

            <Avatar
              variant="rounded"
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                bgcolor: "#f0f0f0",
                color: "#666",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <PhotoCameraIcon />
            </Avatar>
          </Paper>

          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving || !formColor.color}
        >
          {isSaving ? <CircularProgress size={24} /> : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
