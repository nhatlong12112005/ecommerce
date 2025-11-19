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
  Tabs, // Thêm Tabs
  Tab, // Thêm Tab
} from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import SupplierDialog from "./DialogSupplier";
// Import service trực tiếp, bỏ hook cũ
import {
  getAllSuppliers,
  getTrashSuppliers,
  deleteSupplier,
  restoreSupplier,
} from "../../../services/supplier";

export default function SupplierManagement() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0: List, 1: Trash

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailSupplier, setDetailSupplier] = useState(null);

  // Hàm load dữ liệu
  const fetchData = async () => {
    setIsLoading(true);
    try {
      let res;
      if (currentTab === 0) {
        res = await getAllSuppliers();
      } else {
        res = await getTrashSuppliers();
      }
      setData(res || []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách nhà cung cấp");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const handleOpenDialog = (supplier = null) => {
    setDetailSupplier(supplier);
    setIsDialogOpen(true);
  };

  // --- XỬ LÝ XÓA (ĐƯA VÀO THÙNG RÁC) ---
  const handleRemove = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn chuyển nhà cung cấp này vào thùng rác?"
      )
    ) {
      return;
    }
    try {
      const res = await deleteSupplier(id);
      if (res.status === 200 || res.status === 204) {
        toast.success("Đã chuyển vào thùng rác thành công!");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại. Vui lòng thử lại.");
    }
  };

  // --- XỬ LÝ KHÔI PHỤC ---
  const handleRestore = async (id) => {
    try {
      const res = await restoreSupplier(id);
      if (res.status === 200) {
        toast.success("Khôi phục thành công! 🎉");
        fetchData(); // Load lại danh sách thùng rác
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi khôi phục.");
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý nhà cung cấp
      </Typography>

      <div className="flex justify-between items-center pb-4">
        {/* TAB CHUYỂN ĐỔI */}
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
          <Tab label="Danh sách hiện có" />
          <Tab label="Thùng rác" />
        </Tabs>

        {/* Chỉ hiện nút Thêm khi ở Tab 0 */}
        {currentTab === 0 && (
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Thêm nhà cung cấp
          </Button>
        )}
      </div>

      <Divider />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên nhà cung cấp</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>
                {currentTab === 0 ? "Ngày tạo" : "Ngày xóa"}
              </TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email || "N/A"}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    {dayjs(
                      currentTab === 0 ? supplier.createdAt : supplier.deletedAt
                    ).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      {currentTab === 0 ? (
                        // === TAB LIST ===
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenDialog(supplier)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemove(supplier.id)}
                          >
                            Xóa
                          </Button>
                        </>
                      ) : (
                        // === TAB TRASH ===
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRestore(supplier.id)}
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
                <TableCell colSpan={5} align="center">
                  {isLoading ? "Đang tải..." : "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <SupplierDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => fetchData()}
        detailSupplier={detailSupplier}
      />
    </div>
  );
}
