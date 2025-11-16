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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

import CustomerDetailDialog from "./CustomerDetailDialog";
import useGetListCustomer from "../../../hooks/useGetListCustomer";
import {
  updateCustomerStatus,
  deleteCustomer,
} from "../../../services/customer-managment";
import { Toaster, toast } from "react-hot-toast";
import useDebounce from "../../../hooks/useDebounce";

const LIMIT_RECORD_PER_PAGE = 10;

const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        Hủy
      </Button>
      <Button onClick={onConfirm} color="error" autoFocus>
        Xác nhận
      </Button>
    </DialogActions>
  </Dialog>
);

export default function CustomerManagement() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(""); // trạng thái string: "", "active", "locked"
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [processingId, setProcessingId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

  const debouncedSearch = useDebounce(search, 500);

  const { data, total, isLoading } = useGetListCustomer({
    page,
    limit: LIMIT_RECORD_PER_PAGE,
    search: debouncedSearch,
    status, // truyền thẳng status string
    refetchTrigger,
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleOpenDetail = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedUser(null);
  };
  const handleRefetch = () => setRefetchTrigger((prev) => prev + 1);

  const handleCloseConfirm = () =>
    setConfirmDialog({
      isOpen: false,
      title: "",
      content: "",
      onConfirm: () => {},
    });

  const handleToggleLock = async (user) => {
    setProcessingId(user.id);
    handleCloseConfirm();
    const newStatus = !user.isActive;
    try {
      await updateCustomerStatus(user.id, newStatus);
      toast.success(
        `Đã ${newStatus ? "mở khóa" : "khóa"} tài khoản ${user.name}`
      );
      handleRefetch();
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (user) => {
    setProcessingId(user.id);
    handleCloseConfirm();
    try {
      await deleteCustomer(user.id);
      toast.success(`Đã xóa tài khoản ${user.name}`);
      handleRefetch();
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setProcessingId(null);
    }
  };

  const openConfirmDialog = (user, actionType) => {
    if (actionType === "toggleLock") {
      setConfirmDialog({
        isOpen: true,
        title: user.isActive ? "Xác nhận Khóa" : "Xác nhận Mở Khóa",
        content: `Bạn có chắc chắn muốn ${
          user.isActive ? "khóa" : "mở khóa"
        } tài khoản "${user.name}"?`,
        onConfirm: () => handleToggleLock(user),
      });
    } else if (actionType === "delete") {
      setConfirmDialog({
        isOpen: true,
        title: "Xác nhận Xóa",
        content: `Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${user.name}"? Hành động này không thể hoàn tác.`,
        onConfirm: () => handleDelete(user),
      });
    }
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Typography variant="h6" gutterBottom>
        Quản lý tài khoản khách hàng
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex gap-3 flex-wrap items-center">
          <TextField
            label="Tìm theo tên hoặc email"
            size="small"
            style={{ minWidth: 250 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            label="Trạng thái"
            select
            size="small"
            style={{ minWidth: 150 }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            {!isLoading && data.length > 0 ? (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? "Hoạt động" : "Đã khóa"}
                      color={user.isActive ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDetail(user)}
                        disabled={!!processingId}
                      >
                        Xem
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color={user.isActive ? "warning" : "success"}
                        onClick={() => openConfirmDialog(user, "toggleLock")}
                        disabled={!!processingId}
                      >
                        {processingId === user.id ? (
                          <CircularProgress size={20} />
                        ) : user.isActive ? (
                          "Khóa"
                        ) : (
                          "Mở"
                        )}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => openConfirmDialog(user, "delete")}
                        disabled={!!processingId}
                      >
                        {processingId === user.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Xóa"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {isLoading ? "Đang tải..." : "Không tìm thấy tài khoản nào"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {data.length > 0 && total > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {(page - 1) * LIMIT_RECORD_PER_PAGE + 1} -{" "}
            {Math.min(page * LIMIT_RECORD_PER_PAGE, total)} trong tổng số{" "}
            {total} tài khoản
          </div>
          <Pagination
            page={page}
            count={Math.ceil(total / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      <CustomerDetailDialog
        user={selectedUser}
        open={isDetailOpen}
        onClose={handleCloseDetail}
      />

      <ConfirmationDialog
        open={confirmDialog.isOpen}
        onClose={handleCloseConfirm}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        content={confirmDialog.content}
      />
    </div>
  );
}
