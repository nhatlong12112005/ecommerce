import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, MenuItem } from "@mui/material";

import anh from "../../../assets/iphone-17-pro-black.png";

// Dữ liệu mock giống ProductManagement
const mockProducts = [
  {
    _id: "1",
    name: "iPhone 15 Pro Max",
    category: "Điện thoại",
    images: [anh],
    price: 33990000,
    quantity: 12,
    description:
      "Điện thoại cao cấp nhất của Apple, chip A17 Pro, khung titan.",
  },
  {
    _id: "2",
    name: "Samsung Galaxy S24 Ultra",
    category: "Điện thoại",
    images: [
      "https://cdn.tgdd.vn/Products/Images/42/301641/samsung-galaxy-s24-ultra-titanium-black-thumbnew-600x600.jpg",
    ],
    price: 29990000,
    quantity: 8,
    description: "Flagship mạnh mẽ của Samsung, bút S-Pen, camera zoom 10x.",
  },
];

const categories = ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"];

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    images: [],
    price: "",
    quantity: "",
    description: "",
  });

  // Lấy dữ liệu sản phẩm theo id
  useEffect(() => {
    const product = mockProducts.find((p) => p._id === id);
    if (product) {
      setForm(product);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Sản phẩm sau khi sửa:", form);
    alert("Sửa sản phẩm thành công!");
    navigate("/admin/product");
  };

  return (
    <div className="space-y-4">
      <Typography variant="h6">Sửa sản phẩm: {form.name}</Typography>

      <TextField
        fullWidth
        label="Tên sản phẩm"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        select
        label="Danh mục"
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Giá"
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Số lượng"
        type="number"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Mô tả"
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={3}
      />

      {/* Ảnh sản phẩm */}
      <div>
        <Typography variant="subtitle1">Ảnh sản phẩm</Typography>
        {form.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={form.name}
            width={100}
            height={100}
            style={{ objectFit: "cover", marginRight: 8 }}
          />
        ))}
      </div>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Lưu thay đổi
      </Button>
    </div>
  );
};
