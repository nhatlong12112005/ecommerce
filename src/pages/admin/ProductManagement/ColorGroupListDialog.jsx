import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { toast } from "react-toastify";

// Import API
import {
  deleteColorGroup,
  getColorGroupsByProductId,
  getTrashColorGroups,
  restoreColorGroup,
} from "../../../services/product-management";

import ColorImageDialog from "./ColorImageDialog";
import VariantFormDialog from "./VariantFormDialog";

const BACKEND_URL = "http://localhost:3000";

export default function ColorGroupListDialog({ open, onClose, product }) {
  const [colorGroups, setColorGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // State Dialog con
  const [isColorImageDialogOpen, setIsColorImageDialogOpen] = useState(false);
  const [selectedColorGroup, setSelectedColorGroup] = useState(null);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [selectedGroupForVariants, setSelectedGroupForVariants] =
    useState(null);

  // --- LOAD DỮ LIỆU ---
  const fetchData = async () => {
    if (!product?.id) return;
    setIsLoading(true);
    try {
      if (currentTab === 0) {
        const res = await getColorGroupsByProductId(product.id);
        setColorGroups(res.data || []);
      } else {
        const res = await getTrashColorGroups();
        const trashOfThisProduct = Array.isArray(res)
          ? res.filter((item) => item.product?.id === product.id)
          : [];
        setColorGroups(trashOfThisProduct);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách màu sắc");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, product, currentTab]);

  // --- XỬ LÝ XÓA ---
  const handleDeleteColorGroup = async (id) => {
    if (!window.confirm("Bạn có chắc muốn chuyển nhóm màu này vào thùng rác?"))
      return;
    try {
      const res = await deleteColorGroup(id);
      if (res.status === 200) {
        toast.success("Đã chuyển vào thùng rác!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
    }
  };

  // --- XỬ LÝ KHÔI PHỤC ---
  const handleRestore = async (id) => {
    try {
      const res = await restoreColorGroup(id);
      if (res.status === 200) {
        toast.success("Khôi phục thành công!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi khôi phục");
    }
  };

  // --- CÁC HÀM MỞ DIALOG CON ---
  const handleOpenColorImageDialog = (group = null) => {
    setSelectedColorGroup(group);
    setIsColorImageDialogOpen(true);
  };

  const handleOpenVariantDialog = (group) => {
    setSelectedGroupForVariants(group);
    setIsVariantDialogOpen(true);
  };

  const handleCloseColorImageDialog = () => {
    setIsColorImageDialogOpen(false);
    setSelectedColorGroup(null);
  };

  const handleColorImageSuccess = () => {
    fetchData();
  };

  const handleCloseVariantDialog = () => {
    setIsVariantDialogOpen(false);
    setSelectedGroupForVariants(null);
  };

  const handleVariantSuccess = () => {
    fetchData();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Quản lý Phiên bản & Màu sắc - {product?.name}</DialogTitle>

        <DialogContent dividers>
          {/* TABS */}
          <div className="flex justify-between items-center mb-4">
            <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
              <Tab label="Danh sách hiện có" />
              <Tab label="Thùng rác" />
            </Tabs>

            {currentTab === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenColorImageDialog()}
              >
                Thêm Màu Mới
              </Button>
            )}
          </div>

          <Box sx={{ minHeight: 300 }}>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <CircularProgress />
              </div>
            ) : colorGroups.length === 0 ? (
              <Typography align="center" sx={{ mt: 4 }}>
                {currentTab === 0
                  ? "Chưa có nhóm màu nào."
                  : "Thùng rác trống."}
              </Typography>
            ) : (
              colorGroups.map((group) => (
                <Paper
                  key={group.id}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: currentTab === 1 ? "#f5f5f5" : "white",
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-3">
                      {/* --- PHẦN HIỂN THỊ ẢNH ĐÃ CẬP NHẬT --- */}
                      <div
                        className="flex gap-2 flex-wrap"
                        style={{ maxWidth: "300px" }}
                      >
                        {group.imageUrls && group.imageUrls.length > 0 ? (
                          // Lặp qua mảng ảnh để hiển thị tất cả
                          group.imageUrls.map((imgUrl, index) => (
                            <Avatar
                              key={index}
                              src={`${BACKEND_URL}${imgUrl}`}
                              variant="rounded"
                              sx={{
                                width: 50,
                                height: 50,
                                border: "1px solid #ddd",
                                cursor: "pointer",
                              }}
                              // Mở ảnh trong tab mới khi click (tùy chọn)
                              onClick={() =>
                                window.open(`${BACKEND_URL}${imgUrl}`, "_blank")
                              }
                            />
                          ))
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          >
                            No img
                          </Avatar>
                        )}
                      </div>
                      {/* --------------------------------------- */}

                      <div>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Màu: {group.color}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {currentTab === 0
                            ? `${group.variants?.length || 0} phiên bản`
                            : `Đã xóa: ${new Date(
                                group.deletedAt
                              ).toLocaleDateString()}`}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {currentTab === 0 ? (
                        // === MENU THAO TÁC THƯỜNG ===
                        <>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenVariantDialog(group)}
                          >
                            QL Biến thể
                          </Button>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenColorImageDialog(group)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteColorGroup(group.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        // === MENU THÙNG RÁC ===
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<RestoreIcon />}
                          onClick={() => handleRestore(group.id)}
                        >
                          Khôi phục
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Bảng Variants con (Chỉ hiện ở Tab Danh sách) */}
                  {currentTab === 0 && (
                    <TableContainer
                      component={Paper}
                      sx={{ bgcolor: "#fafafa" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Dung lượng</TableCell>
                            <TableCell>Giá bán</TableCell>
                            <TableCell>Tồn kho</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.variants && group.variants.length > 0 ? (
                            group.variants.map((v) => (
                              <TableRow key={v.id}>
                                <TableCell>{v.storage}</TableCell>
                                <TableCell>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(v.price)}
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
                  )}
                </Paper>
              ))
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <ColorImageDialog
        open={isColorImageDialogOpen}
        onClose={handleCloseColorImageDialog}
        onSuccess={handleColorImageSuccess}
        detailColor={selectedColorGroup}
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
