import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import CustomerDetailDialog from "./CustomerDetailDialog";
import {
  fetchDataCustomer,
  getTrashCustomers,
  updateCustomerStatus,
  deleteCustomer,
  restoreCustomer,
} from "../../../services/customer-managment";
import { toast } from "react-toastify";
import useDebounce from "../../../hooks/useDebounce";

const LIMIT_RECORD_PER_PAGE = 10;

export default function CustomerManagement() {
  // ... (Giữ nguyên toàn bộ phần State và Hàm xử lý logic ở trên)
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(-1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (currentTab === 0) {
        const params = {
          page,
          limit: LIMIT_RECORD_PER_PAGE,
          search: debouncedSearch,
          ...(statusFilter !== -1 && { isActive: statusFilter }),
        };
        const res = await fetchDataCustomer(params);
        setUsers(res.data || []);
        setTotal(res.totalItems || 0);
      } else {
        const res = await getTrashCustomers();
        setUsers(res || []);
        setTotal(res.length || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách tài khoản");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, statusFilter, currentTab]);

  const handleChangeTab = (e, newVal) => {
    setCurrentTab(newVal);
    setPage(1);
    setStatusFilter(-1);
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn chuyển tài khoản này vào thùng rác?"
      )
    )
      return;
    try {
      const res = await deleteCustomer(id);
      if (res.status === 200 || res.status === 204 || res.message) {
        toast.success("Đã chuyển vào thùng rác thành công!");
        fetchData();
      }
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreCustomer(id);
      toast.success("Khôi phục tài khoản thành công!");
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi khôi phục");
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.isActive === 1 ? 0 : 1;
    const actionName = newStatus === 1 ? "Mở khóa" : "Khóa";
    if (!window.confirm(`Bạn có chắc muốn ${actionName} tài khoản này?`))
      return;
    try {
      await updateCustomerStatus(user.id, newStatus);
      toast.success(`Đã ${actionName} tài khoản thành công!`);
      fetchData();
    } catch (error) {
      toast.error(`Lỗi khi ${actionName} tài khoản`);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý khách hàng
      </Typography>

      <div className="flex flex-col gap-4 mb-4">
        <Tabs value={currentTab} onChange={handleChangeTab}>
          <Tab label="Danh sách tài khoản" />
          <Tab label="Thùng rác (Đã xóa)" />
        </Tabs>

        {currentTab === 0 && (
          <div className="flex gap-3 items-center bg-white p-2 rounded shadow-sm">
            <TextField
              label="Tìm kiếm (Tên, Email)..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />

            <TextField
              select
              label="Trạng thái"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value={-1}>Tất cả</MenuItem>
              <MenuItem value={1}>Hoạt động</MenuItem>
              <MenuItem value={0}>Đã khóa</MenuItem>
            </TextField>
          </div>
        )}
      </div>

      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              {currentTab === 0 && (
                <TableCell align="center">Trạng thái</TableCell>
              )}
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>

                  {currentTab === 0 && (
                    <TableCell align="center">
                      <Chip
                        label={user.isActive === 1 ? "Active" : "Locked"}
                        color={user.isActive === 1 ? "success" : "error"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  )}

                  <TableCell align="center">
                    <div className="flex gap-1 justify-center">
                      {/* ✅ SỬA LẠI Ở ĐÂY: Chỉ hiện nút Xem chi tiết nếu ở Tab Danh sách (0) */}
                      {currentTab === 0 && (
                        <IconButton
                          color="info"
                          onClick={() => handleViewDetail(user)}
                          title="Xem chi tiết"
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
                      )}

                      {currentTab === 0 ? (
                        // === TAB DANH SÁCH ===
                        <>
                          <IconButton
                            color={user.isActive === 1 ? "warning" : "success"}
                            onClick={() => handleToggleStatus(user)}
                            title={
                              user.isActive === 1 ? "Khóa tài khoản" : "Mở khóa"
                            }
                          >
                            {user.isActive === 1 ? (
                              <LockIcon />
                            ) : (
                              <LockOpenIcon />
                            )}
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user.id)}
                            title="Chuyển vào thùng rác"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        // === TAB THÙNG RÁC ===
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<RestoreIcon />}
                          onClick={() => handleRestore(user.id)}
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
                  Không tìm thấy tài khoản nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length > 0 && currentTab === 0 && (
        <div className="flex justify-end p-4">
          <Pagination
            page={page}
            count={Math.ceil(total / LIMIT_RECORD_PER_PAGE)}
            onChange={(e, v) => setPage(v)}
            color="primary"
          />
        </div>
      )}

      <CustomerDetailDialog
        user={selectedUser}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
