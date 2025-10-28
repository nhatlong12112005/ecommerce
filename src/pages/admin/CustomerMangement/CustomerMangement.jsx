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
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import CustomerDetailDialog from "./CustomerDetailDialog"; // ✅ Import component dialog

const LIMIT_RECORD_PER_PAGE = 10;

// ✅ Cập nhật mock data, thêm địa chỉ và lịch sử mua hàng
const mockUsers = [
  {
    _id: "u1",
    name: "Nguyễn Văn A",
    email: "vana@email.com",
    phone: "0901234567",
    address: "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
    createdAt: "2025-10-25T10:00:00Z",
    status: "active",
    orderHistory: [{ id: "o1", date: "2025-10-25T10:00:00Z", total: 45990000 }],
  },
  {
    _id: "u2",
    name: "Trần Thị B",
    email: "thib@email.com",
    phone: "0987654321",
    address: "456 Nguyễn Trãi, Quận 5, TP.HCM",
    createdAt: "2025-10-24T12:30:00Z",
    status: "active",
    orderHistory: [{ id: "o2", date: "2025-10-24T12:30:00Z", total: 29990000 }],
  },
  {
    _id: "u3",
    name: "Lê Văn C",
    email: "vanc@email.com",
    phone: "0912345678",
    address: "789 Trần Hưng Đạo, Quận 1, TP.HCM",
    createdAt: "2025-10-20T09:00:00Z",
    status: "locked",
    orderHistory: [],
  },
];

export default function CustomerManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // ✅ State để quản lý dialog
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchStatus = filters.status ? user.status === filters.status : true;
    const matchSearch = filters.search
      ? user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedUser(null);
  };

  const handleToggleLock = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? { ...user, status: user.status === "active" ? "locked" : "active" }
          : user
      )
    );
  };

  const handleResetPassword = (user) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn gửi email reset mật khẩu cho ${user.name}?`
      )
    ) {
      alert(`Một liên kết reset mật khẩu đã được gửi đến email: ${user.email}`);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý tài khoản khách hàng
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex gap-3 flex-wrap items-center">
          <TextField
            label="Tìm theo tên hoặc email"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ minWidth: 250 }}
          />
          <TextField
            label="Trạng thái"
            select
            size="small"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="locked">Đã khóa</MenuItem>
          </TextField>
        </div>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === "active" ? "Hoạt động" : "Đã khóa"}
                      color={user.status === "active" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      {/* ✅ Thêm nút Xem chi tiết */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetail(user)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color={user.status === "active" ? "warning" : "success"}
                        onClick={() => handleToggleLock(user._id)}
                      >
                        {user.status === "active" ? "Khóa" : "Mở khóa"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleResetPassword(user)}
                      >
                        Reset Mật khẩu
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy tài khoản nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredUsers.length} trên tổng số {users.length} tài
            khoản
          </div>
          <Pagination
            page={page}
            count={Math.ceil(filteredUsers.length / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      {/* ✅ Render component dialog */}
      <CustomerDetailDialog
        user={selectedUser}
        open={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
