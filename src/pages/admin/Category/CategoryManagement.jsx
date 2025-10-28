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
} from "@mui/material";
import dayjs from "dayjs";
import CategoryDialog from "./DialogCategory"; // Import component dialog

const LIMIT_RECORD_PER_PAGE = 10;

// ✅ Mock data cho danh sách danh mục
const mockCategories = [
  {
    _id: "c1",
    name: "Điện thoại",
    description:
      "Các dòng điện thoại thông minh mới nhất từ các thương hiệu hàng đầu.",
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    _id: "c2",
    name: "Laptop",
    description: "Laptop dành cho công việc, học tập và giải trí.",
    createdAt: "2025-02-20T11:30:00Z",
  },
  {
    _id: "c3",
    name: "Phụ kiện",
    description: "Tai nghe, sạc, ốp lưng và các phụ kiện khác.",
    createdAt: "2025-04-05T14:00:00Z",
  },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [filters, setFilters] = useState({ search: "" });
  const [page, setPage] = useState(1);

  // State để quản lý dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Lọc và tìm kiếm danh mục
  const filteredCategories = categories.filter((category) => {
    const searchTerm = filters.search.toLowerCase();
    return category.name.toLowerCase().includes(searchTerm);
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  // ✅ Chức năng Xóa
  const handleDelete = (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories.filter((c) => c._id !== categoryId));
    }
  };

  // ✅ Chức năng Thêm & Sửa
  const handleSave = (categoryData) => {
    if (categoryData._id) {
      // Sửa
      setCategories(
        categories.map((c) => (c._id === categoryData._id ? categoryData : c))
      );
    } else {
      // Thêm mới
      const newCategory = {
        ...categoryData,
        _id: `c${new Date().getTime()}`, // Tạo id giả
        createdAt: new Date().toISOString(),
      };
      setCategories([newCategory, ...categories]);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý danh mục sản phẩm
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <TextField
          label="Tìm theo tên danh mục"
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          style={{ minWidth: 250 }}
        />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm danh mục
        </Button>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {dayjs(category.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(category)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(category._id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không tìm thấy danh mục nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredCategories.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredCategories.length} danh mục
          </div>
          <Pagination
            page={page}
            count={Math.ceil(filteredCategories.length / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      <CategoryDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        category={editingCategory}
      />
    </div>
  );
}
