import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

export default function FeedbackDialog({ open, onClose, onUpdate, feedback }) {
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    // Điền nội dung phản hồi đã có nếu đang xem lại
    if (feedback?.replyContent) {
      setReplyText(feedback.replyContent);
    } else {
      setReplyText(""); // Reset khi mở góp ý mới
    }
  }, [feedback, open]);

  if (!feedback) return null;

  // Gửi phản hồi
  const handleSendReply = () => {
    const updatedFeedback = {
      ...feedback,
      replyContent: replyText,
      status: "Đã phản hồi", // Tự động cập nhật trạng thái
    };
    onUpdate(updatedFeedback);
    onClose();
  };

  // Chặn thành viên
  const handleBlockUser = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn chặn thành viên ${feedback.userName} (${feedback.userEmail})?`
      )
    ) {
      console.log(`Đã chặn người dùng: ${feedback.userEmail}`);
      alert("Đã chặn thành viên thành công.");
      onClose(); // Đóng dialog sau khi thực hiện hành động
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Chi tiết Góp ý
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Từ: <b>{feedback.userName}</b> - {feedback.userEmail}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ngày gửi: {dayjs(feedback.createdAt).format("DD/MM/YYYY HH:mm")}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {feedback.subject}
          </Typography>
          <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {feedback.content}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Phản hồi
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nhập nội dung phản hồi của bạn..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            // Không cho sửa nếu đã phản hồi
            disabled={feedback.status === "Đã phản hồi"}
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", padding: "16px 24px" }}
      >
        <Button onClick={handleBlockUser} variant="outlined" color="error">
          Chặn thành viên
        </Button>
        <div>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            onClick={handleSendReply}
            variant="contained"
            disabled={!replyText || feedback.status === "Đã phản hồi"}
          >
            {feedback.status === "Đã phản hồi" ? "Đã gửi" : "Gửi phản hồi"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
