// ProductDialog.jsx

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
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
  createProduct,
  updateProduct,
} from "../../../services/product-management";
import useGetListBrand from "../../../hooks/useGetListBrand";
import useGetListCategory from "../../../hooks/useGetListCategory";

export default function ProductDialog({
  open,
  onClose,
  onSuccess,
  detailProduct,
}) {
  const [formProduct, setFormProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
  });

  const { data: brands = [] } = useGetListBrand();
  const { data: categories = [] } = useGetListCategory();

  // Biến boolean để kiểm tra xem có phải đang "Sửa" hay không
  const isEditing = !!(detailProduct && detailProduct.id);

  const handleClose = () => {
    onClose();
    setFormProduct({
      name: "",
      description: "",
      categoryId: "",
      brandId: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      let res;
      if (isEditing) {
        // Chỉ cập nhật tên và mô tả nếu đang "Sửa"
        // (API của bạn cần hỗ trợ việc này,
        // nếu không bạn cần gửi cả categoryId và brandId)
        const payload = {
          name: formProduct.name,
          description: formProduct.description,
        };
        // Nếu API yêu cầu full, hãy dùng:
        // const payload = formProduct;
        res = await updateProduct(detailProduct.id, payload);
      } else {
        // Thêm mới với đầy đủ thông tin
        res = await createProduct(formProduct);
      }

      if (res) {
        onSuccess(); // reload danh sách + đóng dialog
      }
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
  };

  useEffect(() => {
    if (detailProduct && open) {
      const catId = detailProduct.categoryId || detailProduct.category?.id;
      const brdId = detailProduct.brandId || detailProduct.brand?.id;

      setFormProduct({
        name: detailProduct.name || "",
        description: detailProduct.description || "",
        categoryId: catId ? String(catId) : "",
        brandId: brdId ? String(brdId) : "",
      });
    } else {
      setFormProduct({
        name: "",
        description: "",
        categoryId: "",
        brandId: "",
      });
    }
  }, [detailProduct, open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
            value={formProduct.name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
          />

          {/* 👇 ================ THÊM disabled VÀO ĐÂY ================ 👇 */}
          <TextField
            label="Danh mục"
            name="categoryId"
            value={formProduct.categoryId}
            onChange={handleChange}
            select
            fullWidth
            disabled={isEditing} // 👈 KHÓA KHI CHỈNH SỬA
          >
            {categories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          {/* 👇 ================ THÊM disabled VÀO ĐÂY ================ 👇 */}
          <TextField
            label="Thương hiệu"
            name="brandId"
            value={formProduct.brandId}
            onChange={handleChange}
            select
            fullWidth
            disabled={isEditing} // 👈 KHÓA KHI CHỈNH SỬA
          >
            {brands.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Mô tả"
            name="description"
            value={formProduct.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formProduct.name}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
