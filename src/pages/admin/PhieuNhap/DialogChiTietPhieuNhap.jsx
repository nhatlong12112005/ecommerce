// src/pages/goods-receipts/DialogChiTietPhieuNhap.jsx
import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BACKEND_URL = "http://localhost:3000";

const DialogChiTietPhieuNhap = ({ open, onClose, receipt }) => {
  if (!receipt) return null;

  const groupedDetails = useMemo(() => {
    if (!receipt.details) return [];

    const groups = {};

    receipt.details.forEach((d) => {
      const variant = d.productVariant;
      const product = variant?.productColor?.product;
      const productId = product?.id || "unknown_product";
      const productName = product?.name || "Sản phẩm không rõ";

      const productColor = variant?.productColor;
      const imageUrlRelative = productColor?.imageUrls?.[0];
      const imageUrl = imageUrlRelative
        ? `${BACKEND_URL}${imageUrlRelative}`
        : null;
      const colorName = productColor?.color;

      let variantName = "";
      if (colorName) variantName += `Màu: ${colorName}`;
      if (variant?.storage)
        variantName +=
          (variantName ? " | " : "") + `Bộ nhớ: ${variant.storage}`;
      if (!variantName) variantName = variant?.name || "Biến thể không rõ";

      const detailItem = {
        ...d,
        productName,
        variantName,
        imageUrl,
        totalItemCost: d.importPrice * d.quantity,
      };

      if (!groups[productId]) {
        groups[productId] = {
          productId,
          productName,
          variants: [],
          totalQuantity: 0,
          totalCost: 0,
        };
      }

      groups[productId].variants.push(detailItem);
      groups[productId].totalQuantity += d.quantity;
      groups[productId].totalCost += detailItem.totalItemCost;
    });

    return Object.values(groups);
  }, [receipt.details]);

  const totalQuantity = receipt.details.reduce(
    (sum, d) => sum + (d.quantity || 0),
    0
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Chi tiết phiếu nhập - PN{receipt.id}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack
          spacing={1}
          mb={2}
          p={1}
          sx={{ border: "1px solid #eee", borderRadius: 1 }}
        >
          <Typography variant="body1">
            <strong>Nhà cung cấp:</strong> {receipt.supplier?.name}
          </Typography>
          <Typography variant="body1">
            <strong>Ngày nhập:</strong>{" "}
            {new Date(receipt.receiptDate).toLocaleString()}
          </Typography>
        </Stack>

        <Typography variant="h6" mt={3} mb={1}>
          Danh sách biến thể đã nhập
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "35%" }}>Tên Biến thể</TableCell>
                <TableCell align="center" sx={{ width: "10%" }}>
                  Ảnh
                </TableCell>
                <TableCell align="center" sx={{ width: "15%" }}>
                  Số lượng nhập
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  Giá nhập
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  Thành tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedDetails.map((group, groupIndex) => (
                <React.Fragment key={group.productId}>
                  <TableRow sx={{ backgroundColor: "#eef2ff" }}>
                    <TableCell colSpan={5} sx={{ pl: 2, py: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        fontWeight="bold"
                      >
                        Sản phẩm chính: {group.productName}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {group.variants.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ pl: 3 }}>{item.variantName}</TableCell>
                      <TableCell align="center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt="Biến thể"
                            crossOrigin="anonymous"
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            Không ảnh
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.importPrice)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {item.totalItemCost.toLocaleString()} đ
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell
                      colSpan={2}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Tổng nhóm:
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {group.totalQuantity}
                    </TableCell>
                    <TableCell />
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", color: "darkgreen" }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(group.totalCost)}
                    </TableCell>
                  </TableRow>

                  {groupIndex < groupedDetails.length - 1 && (
                    <TableRow sx={{ "& > *": { borderBottom: "none" } }}>
                      <TableCell colSpan={5} sx={{ py: 0 }}>
                        <Divider sx={{ my: 1 }} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction="row"
          justifyContent="flex-end"
          mt={2}
          p={1}
          sx={{ borderTop: "2px solid #3f51b5" }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Tổng số lượng: {totalQuantity} | Tổng tiền phiếu nhập:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(receipt.totalImportCost)}
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DialogChiTietPhieuNhap;
