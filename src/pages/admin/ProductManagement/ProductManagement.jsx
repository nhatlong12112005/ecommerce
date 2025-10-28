import React, { useState } from "react";
import {
  Button,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import ProductDialog from "./DialogRemoveProduct"; // Import dialog sản phẩm

const LIMIT_RECORD_PER_PAGE = 10;

// ✅ Mock dữ liệu sản phẩm (thêm trường 'images')
const mockProducts = [
  {
    _id: "p1",
    name: "iPhone 17 Pro Max",
    price: 33990000,
    quantity: 120,
    category: "Điện thoại",
    description: "Chip A19 Pro, Khung Titanium, Camera 48MP.",
    createdAt: "2025-10-25T10:00:00Z",
    images: [
      "https://cdn.tgdd.vn/Products/Images/42/303869/iphone-15-pro-max-xanh-thumb-1-600x600.jpg",
    ],
  },
  {
    _id: "p2",
    name: "Samsung Galaxy S26 Ultra",
    price: 31990000,
    quantity: 85,
    category: "Điện thoại",
    description: "Bút S-Pen tích hợp, Màn hình Dynamic AMOLED 2X.",
    createdAt: "2025-10-25T14:30:00Z",
    images: [
      "https://cdn.tgdd.vn/Products/Images/42/303792/samsung-galaxy-s24-ultra-den-thumb-600x600.jpg",
    ],
  },
  {
    _id: "p3",
    name: "MacBook Pro M5 14-inch",
    price: 52990000,
    quantity: 50,
    category: "Laptop",
    description: "Hiệu năng đỉnh cao cho người dùng chuyên nghiệp.",
    createdAt: "2025-09-15T09:00:00Z",
    images: [
      "https://cdn.tgdd.vn/Products/Images/44/324104/macbook-air-m3-2024-15-inch-midnight-thumb-600x600.jpg",
    ],
  },
  {
    _id: "p4",
    name: "AirPods Pro 3",
    price: 6490000,
    quantity: 300,
    category: "Phụ kiện",
    description: "Chống ồn chủ động thế hệ mới, Âm thanh không gian.",
    createdAt: "2025-09-30T16:45:00Z",
    images: [
      "https://cdn.tgdd.vn/Products/Images/54/306208/tai-nghe-airpods-pro-2-type-c-thumb-600x600.jpg",
    ],
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    date: "",
  });
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchCategory = filters.category
      ? product.category === filters.category
      : true;
    const matchDate = filters.date
      ? dayjs(product.createdAt).isSame(filters.date, "day")
      : true;
    return matchSearch && matchCategory && matchDate;
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p._id !== productId));
    }
  };

  const handleSave = (productData) => {
    if (productData._id) {
      // Sửa
      setProducts(
        products.map((p) => (p._id === productData._id ? productData : p))
      );
    } else {
      // Thêm mới
      const newProduct = {
        ...productData,
        _id: `p${new Date().getTime()}`,
        createdAt: new Date().toISOString(),
      };
      setProducts([newProduct, ...products]);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex flex-wrap gap-3 items-center">
          <TextField
            label="Tìm theo tên sản phẩm"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ minWidth: 200 }}
          />
          <TextField
            label="Danh mục"
            size="small"
            select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Điện thoại">Điện thoại</MenuItem>
            <MenuItem value="Laptop">Laptop</MenuItem>
            <MenuItem value="Phụ kiện">Phụ kiện</MenuItem>
            <MenuItem value="Máy tính bảng">Máy tính bảng</MenuItem>
          </TextField>
          <TextField
            label="Ngày tạo"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm sản phẩm
        </Button>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Hình ảnh</TableCell> {/* ✅ Thêm cột hình ảnh */}
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]} // Hiển thị ảnh đầu tiên
                        alt={product.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {dayjs(product.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(product)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {" "}
                  {/* Cập nhật colspan */}
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredProducts.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredProducts.length} sản phẩm
          </div>
          <Pagination
            page={page}
            count={Math.ceil(filteredProducts.length / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      <ProductDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}
