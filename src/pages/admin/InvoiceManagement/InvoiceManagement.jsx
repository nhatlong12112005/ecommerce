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
  Chip,
  Box,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import InvoiceDetailsDialog from "./InvoiceDetailsDialog"; // Import dialog chi tiết

const LIMIT_RECORD_PER_PAGE = 10;

// Dữ liệu hóa đơn
const mockInvoices = [
  {
    _id: "HD001",
    orderId: "DH001",
    customerName: "Nguyễn Văn An",
    shippingPhone: "0908123456",
    totalAmount: 33990000,
    status: "Đã thanh toán",
    createdAt: "2025-10-28T10:05:00Z",
    shippingAddress: "123 Đường ABC, Phường X, Quận Y, TP.HCM",
    items: [
      {
        productId: "p1",
        name: "iPhone 17 Pro Max",
        quantity: 1,
        price: 33990000,
      },
    ],
  },
  {
    _id: "HD002",
    orderId: "DH002",
    customerName: "Trần Thị Bích",
    shippingPhone: "0912789101",
    totalAmount: 59480000,
    status: "Chưa thanh toán",
    createdAt: "2025-10-27T14:35:00Z",
    shippingAddress: "456 Đường DEF, Phường A, Quận B, Hà Nội",
    items: [
      {
        productId: "p3",
        name: "MacBook Pro M5 14-inch",
        quantity: 1,
        price: 52990000,
      },
      { productId: "p4", name: "AirPods Pro 3", quantity: 1, price: 6490000 },
    ],
  },
  {
    _id: "HD003",
    orderId: "DH003",
    customerName: "Lê Văn Cường",
    shippingPhone: "0987654321",
    totalAmount: 31990000,
    status: "Đã thanh toán",
    createdAt: "2025-10-26T09:20:00Z",
    shippingAddress: "789 Đường GHI, Phường C, Quận D, Đà Nẵng",
    items: [
      {
        productId: "p2",
        name: "Samsung Galaxy S26 Ultra",
        quantity: 1,
        price: 31990000,
      },
    ],
  },
];

const getStatusChipColor = (status) => {
  return status === "Đã thanh toán" ? "success" : "warning";
};

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Lọc hóa đơn
  const filteredInvoices = invoices.filter((invoice) => {
    const searchTerm = filters.search.toLowerCase();
    const matchSearch =
      invoice._id.toLowerCase().includes(searchTerm) ||
      invoice.customerName.toLowerCase().includes(searchTerm);
    const matchStatus = filters.status
      ? invoice.status === filters.status
      : true;
    const matchDate = filters.date
      ? dayjs(invoice.createdAt).isSame(filters.date, "day")
      : true;
    return matchSearch && matchStatus && matchDate;
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleOpenDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleUpdate = (updatedInvoice) => {
    setInvoices(
      invoices.map((inv) =>
        inv._id === updatedInvoice._id ? updatedInvoice : inv
      )
    );
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý hóa đơn
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex flex-wrap gap-3 items-center">
          <TextField
            label="Tìm theo mã HĐ, tên KH"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ minWidth: 200 }}
          />
          <TextField
            label="Trạng thái"
            size="small"
            select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{ minWidth: 180 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
            <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
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
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice._id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(invoice.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={getStatusChipColor(invoice.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {dayjs(invoice.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenDialog(invoice)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy hóa đơn
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredInvoices.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredInvoices.length} hóa đơn
          </div>
          <Pagination
            page={page}
            count={Math.ceil(filteredInvoices.length / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      <InvoiceDetailsDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onUpdate={handleUpdate}
        invoice={selectedInvoice}
      />
    </div>
  );
}
