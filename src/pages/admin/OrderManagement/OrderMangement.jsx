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
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const LIMIT_RECORD_PER_PAGE = 10;

// Mock data đơn hàng với địa chỉ
const mockOrders = [
  {
    _id: "o1",
    customer: "Nguyễn Văn A",
    total: 45990000,
    status: "Đang xử lý",
    createdAt: "2025-10-25T10:00:00Z",
    address: "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 33990000 },
      { name: "AirPods Pro 2", quantity: 2, price: 6000000 },
    ],
  },
  {
    _id: "o2",
    customer: "Trần Thị B",
    total: 29990000,
    status: "Đã giao",
    createdAt: "2025-10-24T12:30:00Z",
    address: "456 Nguyễn Trãi, Quận 5, TP.HCM",
    items: [{ name: "Samsung Galaxy S24 Ultra", quantity: 1, price: 29990000 }],
  },
  {
    _id: "o3",
    customer: "Lê Văn C",
    total: 28990000,
    status: "Đang xử lý",
    createdAt: "2025-10-20T09:00:00Z",
    address: "789 Trần Hưng Đạo, Quận 1, TP.HCM",
    items: [{ name: "MacBook Air M3", quantity: 1, price: 28990000 }],
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders);
  const [filters, setFilters] = useState({ status: "", date: "" });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Lọc theo trạng thái và ngày
  const filteredOrders = orders.filter((o) => {
    const matchStatus = filters.status ? o.status === filters.status : true;
    const matchDate = filters.date
      ? dayjs(o.createdAt).isSame(filters.date, "day")
      : true;
    return matchStatus && matchDate;
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleChangeStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );
  };

  const handleViewDetail = (order) => {
    navigate(`/admin/order/${order._id}`);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý đơn hàng
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex gap-3 flex-wrap items-center">
          <TextField
            label="Trạng thái"
            select
            size="small"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
            <MenuItem value="Đã giao">Đã giao</MenuItem>
            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
          </TextField>

          <TextField
            label="Ngày đặt"
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
              <TableCell>Khách hàng</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.total.toLocaleString()}₫</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={order.status}
                      onChange={(e) =>
                        handleChangeStatus(order._id, e.target.value)
                      }
                      disabled={order.status !== "Đang xử lý"}
                    >
                      <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                      <MenuItem value="Đã giao">Đã giao</MenuItem>
                      <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell>
                    {dayjs(order.createdAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetail(order)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy đơn hàng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredOrders.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredOrders.length} đơn hàng
          </div>
          <Pagination
            page={page}
            count={Math.ceil(filteredOrders.length / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
}
