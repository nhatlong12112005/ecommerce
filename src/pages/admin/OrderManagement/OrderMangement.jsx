import React, { useEffect, useState, useMemo } from "react";
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
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import OrderDetailsDialog from "./DetailOrder";
import useGetListOrder from "../../../hooks/useGetListOrder";
import { toast } from "react-toastify";
import { updateStatus } from "../../../services/order";
import { useLocation, useNavigate } from "react-router-dom";
const LIMIT_RECORD_PER_PAGE = 10;

// (Các hàm helper getStatusChipColor, getStatusLabel... giữ nguyên)
const getStatusChipColor = (status) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "SHIPPED":
      return "info";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};
const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "SHIPPED":
      return "Đang giao";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

export default function OrderManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  const [page, setPage] = useState(() => {
    return Number(urlParams.get("page") || 1);
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    return urlParams.get("status") || ""; // "" = 'Tất cả'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    data: ordersResponse,
    isLoading,
    handleGetList,
  } = useGetListOrder({
    page,
    limit: LIMIT_RECORD_PER_PAGE,
    status: statusFilter,
  });

  useEffect(() => {
    const params = new URLSearchParams();

    // Chỉ thêm vào URL nếu nó khác giá trị mặc định
    if (page > 1) {
      params.set("page", page.toString());
    }
    if (statusFilter) {
      // Nếu statusFilter không phải ""
      params.set("status", statusFilter);
    }

    // Cập nhật URL mà không reload trang
    navigate({ search: params.toString() }, { replace: true });
  }, [page, statusFilter, navigate]);
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [statusFilter]);

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm update (Giữ nguyên)
  const handleUpdateOrder = async (orderToUpdate) => {
    if (!orderToUpdate || !orderToUpdate.id || !orderToUpdate.status) {
      toast.error("Dữ liệu cập nhật không hợp lệ!");
      return;
    }
    const { id, status } = orderToUpdate;
    try {
      await updateStatus(id, status);
      toast.success(
        `Đã cập nhật đơn hàng #${id.split("-")[0]} sang [${getStatusLabel(
          status
        )}]`
      );
      handleCloseDialog();
      if (handleGetList) {
        handleGetList();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const orderList = ordersResponse?.data || [];
  const totalPages = ordersResponse?.totalPages || 0;
  const totalItems = ordersResponse?.totalItems || 0;

  return (
    <div>
      {/* (Toàn bộ JSX bên dưới giữ nguyên y hệt) */}
      <Typography variant="h6" gutterBottom>
        Quản lý đơn hàng
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex flex-wrap gap-3 items-center">
          <TextField
            label="Trạng thái"
            size="small"
            select
            style={{ minWidth: 180 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="PENDING">Chờ xử lý</MenuItem>
            <MenuItem value="SHIPPED">Đang Giao Hàng</MenuItem>
            <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
            <MenuItem value="CANCELLED">Đã hủy</MenuItem>
          </TextField>
        </div>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : orderList.length > 0 ? (
              orderList.map((order) => (
                <TableRow key={order.id}>
                  <TableCell title={order.id}>
                    {order.id.split("-")[0]}...
                  </TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{order.user.phone}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusChipColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenDialog(order)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không tìm thấy đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {orderList.length} trên tổng số {totalItems} đơn hàng
          </div>
          <Pagination
            page={page}
            count={totalPages}
            onChange={handleChangePage}
            color="primary"
          />
        </div>
      )}

      <OrderDetailsDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onUpdate={handleUpdateOrder}
        order={selectedOrder}
      />
    </div>
  );
}
