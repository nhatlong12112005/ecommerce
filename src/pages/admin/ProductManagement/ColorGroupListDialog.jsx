// ColorGroupListDialog.jsx

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit"; // 👈 THÊM ICON SỬA
import DeleteIcon from "@mui/icons-material/Delete";

// Import Hook
import useGetListColorGroups from "../../../hooks/useGetListColorGroups";
// Import API
import { deleteColorGroup } from "../../../services/product-management";

// Import 2 Dialog con
import ColorImageDialog from "./ColorImageDialog";
import VariantFormDialog from "./VariantFormDialog"; // 👈 IMPORT DIALOG MỚI

const BACKEND_URL = "http://localhost:3000";

export default function ColorGroupListDialog({ open, onClose, product }) {
  const {
    data: colorGroups,
    isLoading,
    handleGetList: refreshColorGroupList,
  } = useGetListColorGroups(product?.id);

  // State cho Dialog Màu/Ảnh
  const [isColorImageDialogOpen, setIsColorImageDialogOpen] = useState(false);
  const [selectedColorGroup, setSelectedColorGroup] = useState(null);

  // State cho Dialog Phiên bản
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [selectedGroupForVariants, setSelectedGroupForVariants] =
    useState(null);

  // --- Handlers cho Dialog Màu/Ảnh ---
  const handleOpenColorImageDialog = (colorGroup = null) => {
    setSelectedColorGroup(colorGroup);
    setIsColorImageDialogOpen(true);
  };

  const handleCloseColorImageDialog = () => {
    setSelectedColorGroup(null);
    setIsColorImageDialogOpen(false);
  };

  const handleColorImageSuccess = () => {
    handleCloseColorImageDialog();
    refreshColorGroupList();
  };

  // --- Handlers cho Dialog Phiên bản ---
  const handleOpenVariantDialog = (colorGroup) => {
    setSelectedGroupForVariants(colorGroup);
    setIsVariantDialogOpen(true);
  };

  const handleCloseVariantDialog = () => {
    setSelectedGroupForVariants(null);
    setIsVariantDialogOpen(false);
  };

  const handleVariantSuccess = () => {
    handleCloseVariantDialog();
    refreshColorGroupList();
  };

  // --- Handler Xóa ---
  const handleDelete = async (colorGroupId) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa nhóm màu này? (Tất cả phiên bản và hình ảnh thuộc nhóm này sẽ bị xóa)"
      )
    ) {
      try {
        await deleteColorGroup(colorGroupId);
        refreshColorGroupList();
      } catch (error) {
        console.error("Xóa nhóm màu thất bại:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="span">
            Quản lý Nhóm Màu & Biến thể cho:{" "}
            <Typography variant="h6" component="span" color="primary">
              {product?.name}
            </Typography>
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
            onClick={() => handleOpenColorImageDialog(null)} // 👈 Mở dialog Màu/Ảnh (chế độ Thêm mới)
          >
            Thêm Nhóm Màu & Ảnh
          </Button>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : colorGroups.length === 0 ? (
              <Typography align="center" sx={{ p: 4 }}>
                Sản phẩm này chưa có nhóm màu nào.
              </Typography>
            ) : (
              colorGroups.map((group) => (
                <Paper key={group.id} sx={{ p: 2, overflow: "hidden" }}>
                  {/* --- Phần Header của Nhóm Màu --- */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={
                          group.imageUrls?.length > 0
                            ? `${BACKEND_URL}${group.imageUrls[0]}`
                            : ""
                        }
                      >
                        {group.color?.[0]}
                      </Avatar>
                      <Typography variant="h6" component="div">
                        {group.color}
                      </Typography>
                    </Box>

                    {/* 👇 ============ CẬP NHẬT CÁC NÚT HÀNH ĐỘNG ============ 👇 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenVariantDialog(group)} // 👈 Mở dialog Phiên bản
                      >
                        Thêm/Sửa Phiên bản
                      </Button>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenColorImageDialog(group)} // 👈 Mở dialog Màu/Ảnh (chế độ Sửa)
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(group.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    {/* 👆 ============ KẾT THÚC CẬP NHẬT ============ 👆 */}
                  </Box>

                  {/* --- Bảng Liệt kê các Phiên bản con --- */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Dung lượng</TableCell>
                          <TableCell>Giá</TableCell>
                          <TableCell>Kho hàng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.variants?.length > 0 ? (
                          group.variants.map((v) => (
                            <TableRow key={v.id}>
                              <TableCell>{v.storage}</TableCell>
                              <TableCell>
                                {v.price.toLocaleString("vi-VN")}đ
                              </TableCell>
                              <TableCell>{v.stock}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              <Typography variant="caption">
                                Chưa có phiên bản nào
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              ))
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Khai báo 2 Dialog ẩn */}
      <ColorImageDialog
        open={isColorImageDialogOpen}
        onClose={handleCloseColorImageDialog}
        onSuccess={handleColorImageSuccess}
        detailColorGroup={selectedColorGroup}
        productId={product?.id}
      />

      <VariantFormDialog
        open={isVariantDialogOpen}
        onClose={handleCloseVariantDialog}
        onSuccess={handleVariantSuccess}
        colorGroup={selectedGroupForVariants}
      />
    </>
  );
}
