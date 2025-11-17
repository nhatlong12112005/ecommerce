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
  CircularProgress, // Thêm loading
} from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify"; // Thêm toast

// --- SỬA 1: Import đúng Dialog và Service ---
import SupplierDialog from "./DialogSupplier";
import { deleteSupplier } from "../../../services/supplier";
import useGetListSupplier from "../../../hooks/useGetListSupplier";

export default function SupplierManagement() {
  const { data, handleGetList, isLoading } = useGetListSupplier();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // --- SỬA 2: Đổi tên state cho rõ ràng ---
  const [detailSupplier, setDetailSupplier] = useState(null);

  const handleOpenDialog = (supplier = null) => {
    // --- SỬA 3: Cập nhật state ---
    setDetailSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleRemove = async (id) => {
    // --- SỬA 4: Thêm xác nhận trước khi xóa ---
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này không?")) {
      return;
    }

    try {
      // --- SỬA 5: Gọi đúng API và thêm toast ---
      await deleteSupplier(id);
      toast.success("Đã xóa nhà cung cấp thành công!");
      handleGetList(); // Tải lại danh sách
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Xóa thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div>
      {/* --- SỬA 6: Cập nhật Tiêu đề --- */}
      <Typography variant="h6" gutterBottom>
        Quản lý nhà cung cấp
      </Typography>

      <div className="flex justify-end gap-3 pb-4">
        {/* --- SỬA 7: Cập nhật nút Thêm --- */}
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm nhà cung cấp
        </Button>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {/* --- SỬA 8: Cập nhật các cột --- */}
            <TableRow>
              <TableCell>Tên nhà cung cấp</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Thêm trạng thái Loading
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                  <Typography>Đang tải dữ liệu...</Typography>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              // --- SỬA 9: Đổi tên biến lặp và hiển thị dữ liệu ---
              data.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email || "N/A"}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    {dayjs(supplier.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(supplier)} // Sửa
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemove(supplier.id)} // Xóa
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Trạng thái không có dữ liệu
              <TableRow>
                {/* --- SỬA 10: Cập nhật colSpan và text --- */}
                <TableCell colSpan={5} align="center">
                  Không tìm thấy nhà cung cấp nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- SỬA 11: Gọi đúng Dialog và truyền đúng prop --- */}
      <SupplierDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => handleGetList()}
        detailSupplier={detailSupplier}
      />
    </div>
  );
}
