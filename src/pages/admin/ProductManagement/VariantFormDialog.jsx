// VariantFormDialog.jsx

import React, { useState, useEffect } from "react";
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
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Import API
import {
  createVariant,
  updateVariant,
  deleteVariant,
} from "../../../services/product-management";

const initialVariantState = { storage: "", price: 0, stock: 0 };

export default function VariantFormDialog({
  open,
  onClose,
  colorGroup, // Nhận vào cả nhóm màu (chứa ID và variants)
  onSuccess,
}) {
  const [variants, setVariants] = useState([]);
  const [originalVariants, setOriginalVariants] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && colorGroup) {
      setVariants(colorGroup.variants || []);
      setOriginalVariants(colorGroup.variants || []);
    } else {
      setVariants([]);
      setOriginalVariants([]);
    }
  }, [open, colorGroup]);

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index] = {
        ...newVariants[index],
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      };
      return newVariants;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...initialVariantState }]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Logic này LUÔN LÀ SỬA (vì ta sửa variants của 1 group đã có)

      // 1. Lọc ra variant mới, cũ, và đã xóa
      const newVariants = variants.filter((v) => !v.id);
      const updatedVariants = variants.filter((v) => v.id);
      const updatedVariantIds = updatedVariants.map((v) => v.id);
      const originalVariantIds = originalVariants.map((v) => v.id);
      const variantsToDelete = originalVariantIds.filter(
        (id) => !updatedVariantIds.includes(id)
      );

      // 2. Thực thi các API
      const apiCalls = [];

      // a. Tạo variant MỚI
      newVariants.forEach((v) =>
        apiCalls.push(
          createVariant({
            ...v,
            productColorId: colorGroup.id, // Dùng ID của group cha
          })
        )
      );

      // b. Cập nhật variant CŨ
      updatedVariants.forEach((v) =>
        apiCalls.push(
          updateVariant(v.id, {
            storage: v.storage,
            price: v.price,
            stock: v.stock,
          })
        )
      );

      // c. Xóa variant
      variantsToDelete.forEach((id) => apiCalls.push(deleteVariant(id)));

      // Chạy tất cả song song
      await Promise.all(apiCalls);
      onSuccess(); // Báo thành công
    } catch (error) {
      console.error("Lưu phiên bản thất bại:", error);
      console.log("Lỗi response từ server:", error.response?.data); // 👈 Thêm dòng này
      const errMsg =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      alert(`Lưu thất bại: ${errMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Logic kiểm tra form
  const isFormInvalid =
    variants.length === 0 ||
    variants.some((v) => !v.storage || v.price <= 0 || v.stock < 0);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="span">
          Quản lý Phiên bản cho màu:{" "}
          <Typography variant="h6" component="span" color="primary">
            {colorGroup?.color}
          </Typography>
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
        <Box sx={{ pt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">
              Quản lý Phiên bản (Dung lượng, Giá, Kho)
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={addVariant}
            >
              Thêm phiên bản
            </Button>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}
          >
            {variants.length === 0 && (
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ mt: 4 }}
              >
                Nhấn "Thêm phiên bản" để bắt đầu
              </Typography>
            )}
            {variants.map((variant, index) => (
              <Paper
                key={variant.id || `new-${index}`}
                variant="outlined"
                sx={{ p: 2 }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Dung lượng (Storage)"
                      name="storage"
                      value={variant.storage}
                      onChange={(e) => handleVariantChange(index, e)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Giá"
                      name="price"
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, e)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Kho hàng"
                      name="stock"
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, e)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} container justifyContent="flex-end">
                    <IconButton
                      color="error"
                      onClick={() => removeVariant(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
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
          {isSaving ? "Đang lưu..." : "Cập nhật Phiên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
