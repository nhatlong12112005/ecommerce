import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Paper,
  Grid,
  Typography,
  Tooltip, // Thêm Tooltip để giải thích
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info"; // Icon thông tin
import { toast } from "react-toastify";

import {
  createVariant,
  updateVariant,
  deleteVariant,
} from "../../../services/product-management";

export default function VariantFormDialog({
  open,
  onClose,
  colorGroup,
  onSuccess,
}) {
  const [variants, setVariants] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && colorGroup) {
      setVariants(colorGroup.variants || []);
    } else {
      setVariants([]);
    }
  }, [open, colorGroup]);

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [name]: value };
    setVariants(newVariants);
  };

  // Khi thêm dòng mới, mặc định stock = 0
  const addNewVariantRow = () => {
    setVariants([...variants, { id: null, storage: "", price: 0, stock: 0 }]);
  };

  const removeVariant = async (index) => {
    const variantToDelete = variants[index];
    if (variantToDelete.id) {
      if (!window.confirm("Bạn có chắc muốn xóa phiên bản này?")) return;
      try {
        await deleteVariant(variantToDelete.id);
        toast.success("Đã xóa phiên bản thành công");
      } catch (error) {
        console.error(error);
        toast.error("Xóa thất bại");
        return;
      }
    }
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const v of variants) {
        if (!v.storage || v.price < 0) continue; // Bỏ qua check stock < 0 vì stock bị disable

        const payload = {
          storage: v.storage,
          price: Number(v.price),
          // stock: Number(v.stock), // Có thể gửi hoặc không, BE nên ignore nếu update
          // Tuy nhiên cứ gửi giá trị hiện tại (hoặc 0) để BE xử lý logic tạo mới
          stock: v.id ? Number(v.stock) : 0,
          productColorId: colorGroup.id,
        };

        if (v.id) {
          await updateVariant(v.id, payload);
        } else {
          await createVariant(payload);
        }
      }
      toast.success("Cập nhật danh sách phiên bản thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu phiên bản");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Quản lý Biến thể (Màu: {colorGroup?.color})
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          disabled={isSaving}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          {/* Tiêu đề cột */}
          <Grid container spacing={2} sx={{ mb: 1, fontWeight: "bold" }}>
            <Grid item xs={3}>
              Dung lượng
            </Grid>
            <Grid item xs={4}>
              Giá bán (VNĐ)
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              Tồn kho
              <Tooltip title="Số lượng tồn kho được quản lý qua Phiếu Nhập/Xuất, không sửa trực tiếp tại đây.">
                <InfoIcon
                  fontSize="small"
                  color="action"
                  style={{ cursor: "help" }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={2} textAlign="right">
              Xóa
            </Grid>
          </Grid>

          {variants.map((variant, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, mb: 2, bgcolor: variant.id ? "white" : "#f9fbe7" }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    label="GB/TB"
                    name="storage"
                    value={variant.storage}
                    onChange={(e) => handleVariantChange(index, e)}
                    size="small"
                    fullWidth
                    required
                    placeholder="Vd: 128GB"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Giá"
                    name="price"
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, e)}
                    size="small"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          đ
                        </span>
                      ),
                    }}
                  />
                </Grid>

                {/* --- CỘT TỒN KHO (DISABLED) --- */}
                <Grid item xs={3}>
                  <TextField
                    label="Tồn kho"
                    name="stock"
                    type="number"
                    value={variant.stock || 0} // Hiện 0 nếu chưa có
                    size="small"
                    fullWidth
                    disabled // ⛔ KHÓA KHÔNG CHO NHẬP
                    helperText={variant.id ? "Từ kho" : "Mặc định 0"}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#333", // Giữ màu chữ đậm cho dễ đọc
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={2} textAlign="right">
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

          <Button
            startIcon={<AddIcon />}
            onClick={addNewVariantRow}
            variant="outlined"
            fullWidth
            sx={{ mt: 1, borderStyle: "dashed" }}
          >
            Thêm phiên bản mới
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
