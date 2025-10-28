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
import SupplierDialog from "./SupplierDialog";

const LIMIT_RECORD_PER_PAGE = 10;

const mockSuppliers = [
  {
    _id: "s1",
    name: "FPT Synnex",
    email: "contact@fpt.com.vn",
    phone: "02873007373",
    address: "2A Đ. Nguyễn Thị Minh Khai, Đa Kao, Quận 1, TP.HCM",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    _id: "s2",
    name: "Digiworld",
    email: "info@dgw.com.vn",
    phone: "02839290059",
    address:
      "195-197 Đ. Nguyễn Thái Bình, Phường Nguyễn Thái Bình, Quận 1, TP.HCM",
    createdAt: "2025-03-10T11:30:00Z",
  },
  {
    _id: "s3",
    name: "Petrosetco",
    email: "info@petrosetco.com.vn",
    phone: "02839117777",
    address: "1-5 Đ. Lê Duẩn, Bến Nghé, Quận 1, TP.HCM",
    createdAt: "2025-05-20T14:00:00Z",
  },
];

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [filters, setFilters] = useState({ search: "" });
  const [page, setPage] = useState(1);

  // State để quản lý dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Lọc và tìm kiếm nhà cung cấp
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchTerm = filters.search.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.email.toLowerCase().includes(searchTerm) ||
      supplier.phone.includes(searchTerm)
    );
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleOpenDialog = (supplier = null) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSupplier(null);
  };

  // ✅ Chức năng Xóa
  const handleDelete = (supplierId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      setSuppliers(suppliers.filter((s) => s._id !== supplierId));
    }
  };

  // ✅ Chức năng Thêm & Sửa
  const handleSave = (supplierData) => {
    if (supplierData._id) {
      // Sửa
      setSuppliers(
        suppliers.map((s) => (s._id === supplierData._id ? supplierData : s))
      );
    } else {
      // Thêm mới
      const newSupplier = {
        ...supplierData,
        _id: `s${new Date().getTime()}`, // Tạo id giả
        createdAt: new Date().toISOString(),
      };
      setSuppliers([newSupplier, ...suppliers]);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý nhà cung cấp
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <TextField
          label="Tìm theo tên, email, SĐT"
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          style={{ minWidth: 250 }}
        />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm nhà cung cấp
        </Button>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên nhà cung cấp</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    {dayjs(supplier.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
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
                        onClick={() => handleDelete(supplier._id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy nhà cung cấp nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredSuppliers.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredSuppliers.length} nhà cung cấp
          </div>
          <Pagination
            page={page}
            count={Math.ceil(filteredSuppliers.length / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      <SupplierDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        supplier={editingSupplier}
      />
    </div>
  );
}
