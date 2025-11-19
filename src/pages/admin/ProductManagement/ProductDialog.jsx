import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify"; // Import Toast

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: brands = [] } = useGetListBrand();
  const { data: categories = [] } = useGetListCategory();

  const isEditing = !!(detailProduct && detailProduct.id);

  const handleClose = () => {
    onClose();
    setFormProduct({
      name: "",
      description: "",
      categoryId: "",
      brandId: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Sửa
        await updateProduct(detailProduct.id, formProduct);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        // Thêm
        await createProduct(formProduct);
        toast.success("Thêm sản phẩm mới thành công!");
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);

      // --- BẮT LỖI TỪ BACKEND ---
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const msg = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;

        // Lỗi 400: Thường là trùng tên hoặc đã có trong thùng rác
        if (error.response.status === 400) {
          toast.warning(msg);
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Có lỗi xảy ra khi lưu sản phẩm.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (detailProduct && open) {
      setFormProduct({
        name: detailProduct.name || "",
        description: detailProduct.description || "",
        categoryId:
          detailProduct.category?.id || detailProduct.categoryId || "",
        brandId: detailProduct.brand?.id || detailProduct.brandId || "",
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          <TextField
            label="Danh mục"
            name="categoryId"
            value={formProduct.categoryId}
            onChange={handleChange}
            select
            fullWidth
            // disabled={isEditing} // Bạn có thể mở lại nếu muốn cho phép sửa danh mục
          >
            {categories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Thương hiệu"
            name="brandId"
            value={formProduct.brandId}
            onChange={handleChange}
            select
            fullWidth
            // disabled={isEditing} // Bạn có thể mở lại nếu muốn cho phép sửa thương hiệu
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
            disabled={isSubmitting}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formProduct.name || isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
