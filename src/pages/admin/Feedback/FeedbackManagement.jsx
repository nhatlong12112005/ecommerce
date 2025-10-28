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
} from "@mui/material";
import dayjs from "dayjs";
import FeedbackDialog from "./FeedbackDialog"; // Import dialog chi tiết góp ý

const LIMIT_RECORD_PER_PAGE = 10;

// ✅ Mock dữ liệu góp ý
const mockFeedback = [
  {
    _id: "fb001",
    userName: "Trần Văn Hoàng",
    userEmail: "hoangtv@example.com",
    subject: "Giao diện khó sử dụng trên di động",
    content:
      "Giao diện trang chi tiết sản phẩm trên điện thoại bị vỡ, các nút bấm quá nhỏ, rất khó để thao tác. Mong quý công ty sớm khắc phục.",
    status: "Mới", // Trạng thái: Mới, Đã phản hồi
    createdAt: "2025-10-28T11:30:00Z",
    replyContent: "",
  },
  {
    _id: "fb002",
    userName: "Lê Thị Mai",
    userEmail: "mailt@example.com",
    subject: "Đề xuất thêm tính năng thanh toán qua ví điện tử",
    content:
      "Hiện tại trang web chỉ hỗ trợ thanh toán qua thẻ và COD. Tôi đề xuất nên tích hợp thêm các ví điện tử phổ biến như MoMo, ZaloPay để tiện lợi hơn cho khách hàng.",
    status: "Đã phản hồi",
    createdAt: "2025-10-27T15:00:00Z",
    replyContent:
      "Cảm ơn góp ý của bạn. Chúng tôi sẽ xem xét và cập nhật tính năng này trong tương lai gần.",
  },
  {
    _id: "fb003",
    userName: "Phạm Hùng Cường",
    userEmail: "cuongph@example.com",
    subject: "Không tìm thấy sản phẩm",
    content:
      "Tôi đã tìm kiếm sản phẩm 'Tai nghe Sony WH-1000XM5' nhưng không thấy có trên trang web. Cửa hàng có kinh doanh sản phẩm này không?",
    status: "Mới",
    createdAt: "2025-10-26T09:00:00Z",
    replyContent: "",
  },
];

// Hàm lấy màu cho Chip trạng thái
const getStatusChipColor = (status) => {
  switch (status) {
    case "Mới":
      return "warning";
    case "Đã phản hồi":
      return "success";
    default:
      return "default";
  }
};

export default function FeedbackManagement() {
  const [feedbackList, setFeedbackList] = useState(mockFeedback);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Lọc và tìm kiếm góp ý
  const filteredFeedback = feedbackList.filter((fb) => {
    const searchTerm = filters.search.toLowerCase();
    const matchSearch =
      fb.userName.toLowerCase().includes(searchTerm) ||
      fb.userEmail.toLowerCase().includes(searchTerm) ||
      fb.subject.toLowerCase().includes(searchTerm);
    const matchStatus = filters.status ? fb.status === filters.status : true;
    return matchSearch && matchStatus;
  });

  const handleChangePage = (event, value) => setPage(value);

  const handleOpenDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFeedback(null);
  };

  // Cập nhật lại danh sách sau khi phản hồi
  const handleUpdateFeedback = (updatedFeedback) => {
    setFeedbackList(
      feedbackList.map((fb) =>
        fb._id === updatedFeedback._id ? updatedFeedback : fb
      )
    );
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý Góp ý & Phản hồi
      </Typography>

      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex flex-wrap gap-3 items-center">
          <TextField
            label="Tìm theo người gửi, email, chủ đề"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ minWidth: 280 }}
          />
          <TextField
            label="Trạng thái"
            size="small"
            select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Mới">Mới</MenuItem>
            <MenuItem value="Đã phản hồi">Đã phản hồi</MenuItem>
          </TextField>
        </div>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người gửi</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((fb) => (
                <TableRow key={fb._id}>
                  <TableCell>
                    <div>{fb.userName}</div>
                    <div className="text-xs text-gray-500">{fb.userEmail}</div>
                  </TableCell>
                  <TableCell>{fb.subject}</TableCell>
                  <TableCell>
                    {dayjs(fb.createdAt).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={fb.status}
                      color={getStatusChipColor(fb.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenDialog(fb)}
                    >
                      Xem & Phản hồi
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có góp ý nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredFeedback.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredFeedback.length} góp ý
          </div>
          <Pagination
            page={page}
            count={Math.ceil(filteredFeedback.length / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      <FeedbackDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onUpdate={handleUpdateFeedback}
        feedback={selectedFeedback}
      />
    </div>
  );
}
