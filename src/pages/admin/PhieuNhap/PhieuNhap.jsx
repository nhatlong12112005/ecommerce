// src/pages/goods-receipts/PhieuNhap.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Stack,
  TextField,
  MenuItem,
  Pagination,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import dayjs from "dayjs";

import useGetListSupplier from "../../../hooks/useGetListSupplier";
import useGetListGoodsReceipt from "../../../hooks/useGetGoodsReceiptList";
import DialogPhieuNhap from "./DialogPhieuNhap";
import DialogChiTietPhieuNhap from "./DialogChiTietPhieuNhap"; // <-- import dialog chi tiết

const LIMIT_RECORD_PER_PAGE = 10;

const PhieuNhap = () => {
  const [page, setPage] = useState(1);
  const [supplierId, setSupplierId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null); // <-- phiếu nhập chọn để xem
  const [openDetail, setOpenDetail] = useState(false); // <-- mở dialog chi tiết

  const { data: supplierData = [] } = useGetListSupplier();
  const {
    data,
    total = 0,
    isLoading: loading,
    handleGetList,
  } = useGetListGoodsReceipt({
    page,
    limit: LIMIT_RECORD_PER_PAGE,
    supplierId,
    fromDate,
    toDate,
  });

  const receipts = data?.receipts || [];

  const handleReceiptCreated = () => {
    setOpenDialog(false);
    handleGetList();
    if (page !== 1) setPage(1);
  };

  // --- Xem chi tiết ---
  const handleViewDetail = (receipt) => {
    setSelectedReceipt(receipt);
    setOpenDetail(true);
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Danh Sách Phiếu Nhập Kho</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Tạo Phiếu Nhập
        </Button>
      </Stack>

      {/* Bộ lọc */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Nhà cung cấp"
            select
            size="small"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {supplierData.map((sup) => (
              <MenuItem key={sup.id} value={sup.id}>
                {sup.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={fromDate || ""}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={toDate || ""}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Paper>

      {/* Bảng phiếu nhập */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell>Tổng số lượng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Ngày nhập</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && receipts.length > 0 ? (
              receipts.map((item) => {
                const totalQuantity = item.details?.reduce(
                  (sum, detail) => sum + (detail.quantity || 0),
                  0
                );
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.supplier?.name}</TableCell>
                    <TableCell>{totalQuantity}</TableCell>
                    <TableCell>
                      {item.totalImportCost.toLocaleString()} đ
                    </TableCell>
                    <TableCell>
                      {dayjs(item.receiptDate).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetail(item)}
                        >
                          Xem chi tiết
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loading ? "Đang tải..." : "Không có phiếu nhập nào"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {receipts.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Pagination
            page={page}
            count={Math.ceil(total / LIMIT_RECORD_PER_PAGE)}
            onChange={(e, value) => setPage(value)}
          />
        </Stack>
      )}

      {/* Dialog tạo phiếu nhập */}
      <DialogPhieuNhap
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={handleReceiptCreated}
      />

      {/* Dialog chi tiết phiếu nhập */}
      <DialogChiTietPhieuNhap
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        receipt={selectedReceipt}
      />
    </Container>
  );
};

export default PhieuNhap;
