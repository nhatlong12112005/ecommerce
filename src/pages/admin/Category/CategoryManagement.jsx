import React, { useState } from "react";
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
} from "@mui/material";
import dayjs from "dayjs";
import CategoryDialog from "./DialogCategory";
import useGetListCategory from "../../../hooks/useGetListCategory";
import { removeCategories } from "../../../services/category-management";

export default function CategoryManagement() {
  const { data, handleGetList, isLoading } = useGetListCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailCategory, setDetailCategory] = useState(null);

  const handleOpenDialog = (category = null) => {
    setDetailCategory(category);
    setIsDialogOpen(true);
  };

  const handleRemove = async (id) => {
    try {
      const res = await removeCategories(id);
      if (res.status === 204) {
        handleGetList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý danh mục sản phẩm
      </Typography>

      <div className="flex justify-end gap-3 pb-4">
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
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
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
                        onClick={() => handleRemove(category.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  {isLoading ? "Đang tải..." : "Không tìm thấy danh mục nào"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => handleGetList()}
        detailCategory={detailCategory}
      />
    </div>
  );
}
