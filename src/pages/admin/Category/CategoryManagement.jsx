import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import dayjs from "dayjs";
import CategoryDialog from "./DialogCategory";
import {
  removeCategories,
  fetchCategories,
  fetchTrashCategories,
  restoreCategory,
} from "../../../services/category-management";

// 1. Import Toast
import { toast } from "react-toastify";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailCategory, setDetailCategory] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let res;
      if (currentTab === 0) {
        res = await fetchCategories();
      } else {
        res = await fetchTrashCategories();
      }
      setCategories(res || []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách!"); // Thông báo lỗi tải trang
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const handleOpenDialog = (category = null) => {
    setDetailCategory(category);
    setIsDialogOpen(true);
  };

  // --- XỬ LÝ XÓA ---
  const handleRemove = async (id) => {
    // Dùng window.confirm hoặc custom modal khác (toast không dùng để confirm)
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn chuyển danh mục này vào thùng rác?"
      )
    )
      return;

    try {
      const res = await removeCategories(id);
      if (res.status === 200) {
        toast.success("Đã chuyển vào thùng rác thành công!"); // ✅ Toast thành công
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại! Vui lòng thử lại."); // ❌ Toast lỗi
    }
  };

  // --- XỬ LÝ KHÔI PHỤC ---
  const handleRestore = async (id) => {
    try {
      const res = await restoreCategory(id);
      if (res.status === 200) {
        toast.success("Khôi phục danh mục thành công! 🎉"); // ✅ Toast thành công
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi khôi phục danh mục."); // ❌ Toast lỗi
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý danh mục sản phẩm
      </Typography>

      <div className="flex justify-between items-center pb-4">
        <Tabs
          value={currentTab}
          onChange={(e, newVal) => setCurrentTab(newVal)}
        >
          <Tab label="Danh sách hiện có" />
          <Tab label="Thùng rác" />
        </Tabs>

        {currentTab === 0 && (
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Thêm danh mục
          </Button>
        )}
      </div>

      <Divider />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>
                {currentTab === 0 ? "Ngày tạo" : "Ngày xóa"}
              </TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {dayjs(
                      currentTab === 0 ? category.createdAt : category.deletedAt
                    ).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      {currentTab === 0 ? (
                        <>
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
                            onClick={() => handleRemove(category.id)}
                          >
                            Xóa
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRestore(category.id)}
                        >
                          Khôi phục
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  {isLoading ? "Đang tải..." : "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => fetchData()}
        detailCategory={detailCategory}
      />
    </div>
  );
}
