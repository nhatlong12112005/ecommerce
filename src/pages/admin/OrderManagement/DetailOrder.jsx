import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";

// Mock dữ liệu đơn hàng (có thêm địa chỉ)
const mockOrders = [
  {
    _id: "o1",
    customer: "Nguyễn Văn A",
    address: "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
    total: 45990000,
    status: "Đang xử lý",
    createdAt: "2025-10-25T10:00:00Z",
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 33990000 },
      { name: "AirPods Pro 2", quantity: 2, price: 6000000 },
    ],
  },
  {
    _id: "o2",
    customer: "Trần Thị B",
    address: "456 Đường Nguyễn Trãi, Quận 5, TP.HCM",
    total: 29990000,
    status: "Đã giao",
    createdAt: "2025-10-24T12:30:00Z",
    items: [{ name: "Samsung Galaxy S24 Ultra", quantity: 1, price: 29990000 }],
  },
  {
    _id: "o3",
    customer: "Lê Văn C",
    address: "789 Đường Hai Bà Trưng, Quận 1, TP.HCM",
    total: 28990000,
    status: "Đang xử lý",
    createdAt: "2025-10-20T09:00:00Z",
    items: [{ name: "MacBook Air M3", quantity: 1, price: 28990000 }],
  },
];

export default function DetailOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const found = mockOrders.find((o) => o._id === id);
    if (found) setOrder(found);
  }, [id]);

  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Chi tiết đơn hàng: {order.customer}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1">
        <strong>Trạng thái:</strong> {order.status}
      </Typography>
      <Typography variant="body1">
        <strong>Ngày đặt:</strong>{" "}
        {dayjs(order.createdAt).format("YYYY-MM-DD HH:mm")}
      </Typography>
      <Typography variant="body1">
        <strong>Địa chỉ giao hàng:</strong> {order.address}
      </Typography>
      <Typography variant="body1">
        <strong>Tổng tiền:</strong> {order.total.toLocaleString()}₫
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Sản phẩm trong đơn:</Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price.toLocaleString()}₫</TableCell>
                <TableCell>
                  {(item.price * item.quantity).toLocaleString()}₫
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        sx={{ mt: 3 }}
        variant="contained"
        onClick={() => navigate("/admin/order")}
      >
        Quay lại
      </Button>
    </div>
  );
}
