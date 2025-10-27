import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import anh from "../../../assets/iphone-17-pro-black.png";
const mockCategories = [
  { _id: "c1", name: "Điện thoại" },
  { _id: "c2", name: "Laptop" },
  { _id: "c3", name: "Máy tính bảng" },
  { _id: "c4", name: "Phụ kiện" },
];

const mockProducts = [
  {
    _id: "1",
    name: "iPhone 15 Pro Max",
    description: "Điện thoại cao cấp",
    price: 33990000,
    salePercent: 5,
    amount: 12,
    categoryId: "c1",
    images: [anh],
  },
];

export default function CreateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    salePercent: "",
    amount: "",
    categoryId: "",
    images: [],
  });

  useEffect(() => {
    if (id) {
      const product = mockProducts.find((p) => p._id === id);
      if (product) setForm(product);
    }
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => {
    const newImages = Array.from(e.target.files).map((f) =>
      URL.createObjectURL(f)
    );
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };
  const handleRemoveImage = (idx) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));

  const handleSubmit = () => {
    console.log(form);
    alert(id ? "Sửa sản phẩm thành công!" : "Thêm sản phẩm thành công!");
    navigate("/admin/product");
  };

  return (
    <div className="space-y-4">
      <Typography variant="h6">
        {id ? `Sửa sản phẩm ${form.name}` : "Tạo sản phẩm mới"}
      </Typography>

      {["name", "description", "price", "salePercent", "amount"].map(
        (field) => (
          <TextField
            key={field}
            fullWidth
            label={
              field === "name"
                ? "Tên sản phẩm"
                : field === "description"
                ? "Mô tả"
                : field === "price"
                ? "Giá"
                : field === "salePercent"
                ? "Phần trăm giảm"
                : "Số lượng"
            }
            name={field}
            type={
              ["price", "salePercent", "amount"].includes(field)
                ? "number"
                : "text"
            }
            value={form[field]}
            onChange={handleChange}
            multiline={field === "description"}
            rows={field === "description" ? 3 : 1}
          />
        )
      )}

      <TextField
        fullWidth
        select
        label="Danh mục"
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
      >
        {mockCategories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <div>
        <Button variant="outlined" component="label" startIcon={<Add />}>
          Chọn ảnh
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        <div className="flex gap-2 mt-2 flex-wrap">
          {form.images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                alt={`img-${idx}`}
                className="w-24 h-24 object-cover border rounded"
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveImage(idx)}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "white",
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        {id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      </Button>
    </div>
  );
}
