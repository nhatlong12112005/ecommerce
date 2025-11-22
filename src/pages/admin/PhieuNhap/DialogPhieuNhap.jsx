// src/pages/goods-receipts/DialogPhieuNhap.js
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Stack,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Divider,
} from "@mui/material";
import { Delete, AddCircleOutline } from "@mui/icons-material";
import { toast } from "react-toastify";

// Hooks & services
import useGetListSupplier from "../../../hooks/useGetListSupplier";
import useGetListProduct from "../../../hooks/useGetListProduct";
import { createGoodsReceipt } from "../../../services/goodsReceip";

// --- URL Backend ---
const BACKEND_URL = "http://localhost:3000";
// ---

// Biến dùng để tạo key duy nhất cho các ô tìm kiếm (Không phải state)
let nextSearchInputId = 1;

const DialogPhieuNhap = ({ open, onClose, onSuccess }) => {
  // <-- Nhận onSuccess
  const { data: suppliers = [] } = useGetListSupplier();
  const { data: mainProductsData = [] } = useGetListProduct({ limit: 1000 });

  const [supplier, setSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [searchInputs, setSearchInputs] = useState([
    { id: nextSearchInputId++, selected: null },
  ]);

  // --- LOGIC XỬ LÝ VÀ LÀM PHẲNG DỮ LIỆU SẢN PHẨM (Giữ nguyên) ---
  const { mainProductOptions, flattenedVariants } = useMemo(() => {
    const options = [];
    const variants = [];

    mainProductsData.forEach((product) => {
      options.push({ id: product.id, name: product.name });
      if (!product.productColors) return;
      product.productColors.forEach((productColor) => {
        const imageUrlRelative = productColor.imageUrls?.[0];
        const imageUrl = imageUrlRelative
          ? `${BACKEND_URL}${imageUrlRelative}`
          : null;
        if (!productColor.variants) return;
        productColor.variants.forEach((variant) => {
          variants.push({
            id: variant.id,
            quantity: 0,
            importPrice: 0,
            productId: product.id,
            productName: product.name,
            variantName: `${productColor.color} - ${variant.storage}`,
            imageUrl: imageUrl,
            price: variant.price,
            stock: variant.stock,
          });
        });
      });
    });
    return { mainProductOptions: options, flattenedVariants: variants };
  }, [mainProductsData]);

  const allVariants = flattenedVariants;

  // Reset state khi đóng/mở dialog
  useEffect(() => {
    if (!open) {
      setSupplier(null);
      setItems([]);
      nextSearchInputId = 1;
      setSearchInputs([{ id: nextSearchInputId++, selected: null }]);
    }
  }, [open]);

  // --- HANDLER CHO Ô TÌM KIẾM ĐỘNG (Giữ nguyên) ---
  const handleSearchSelect = (key, value) => {
    if (!value) return;

    const existingProductIndex = items.findIndex(
      (group) => group.productId === value.id
    );

    const variantsToAdd = allVariants
      .filter((p) => p.productId === value.id)
      .map((variant) => {
        const existingVariant =
          existingProductIndex !== -1
            ? items[existingProductIndex].variants.find(
                (v) => v.productVariantId === variant.id
              )
            : null;

        return {
          productVariantId: variant.id,
          productVariant: variant,
          quantity: existingVariant ? existingVariant.quantity : 0,
          importPrice: existingVariant ? existingVariant.importPrice : 0,
        };
      });

    const newGroup = {
      productId: value.id,
      productName: value.name,
      variants: variantsToAdd,
    };

    setItems((prevItems) => {
      if (existingProductIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingProductIndex] = newGroup;
        return newItems;
      } else {
        return [...prevItems, newGroup];
      }
    });

    setSearchInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === key ? { ...input, selected: value } : input
      )
    );
  };

  const handleAddNewSearchInput = () => {
    const lastInput = searchInputs[searchInputs.length - 1];

    if (lastInput && lastInput.selected) {
      setSearchInputs((prevInputs) => [
        ...prevInputs,
        { id: nextSearchInputId++, selected: null },
      ]);
    } else if (lastInput && !lastInput.selected) {
      toast.warn(
        "Vui lòng chọn sản phẩm cho ô tìm kiếm hiện tại trước khi thêm ô mới."
      );
    } else {
      setSearchInputs([{ id: nextSearchInputId++, selected: null }]);
    }
  };

  const handleRemoveSearchInput = (key, productId) => {
    if (productId) {
      handleRemoveGroup(productId);
    }

    setSearchInputs((prevInputs) => {
      const newInputs = prevInputs.filter((input) => input.id !== key);
      if (newInputs.length === 0) {
        return [{ id: nextSearchInputId++, selected: null }];
      }
      return newInputs;
    });
  };

  // --- HANDLER CHO BẢNG NHẬP LIỆU (Giữ nguyên) ---
  const handleChangeItem = (productId, variantId, field, value) => {
    setItems((prevItems) =>
      prevItems.map((group) => {
        if (group.productId === productId) {
          return {
            ...group,
            variants: group.variants.map((variant) =>
              variant.productVariantId === variantId
                ? { ...variant, [field]: value }
                : variant
            ),
          };
        }
        return group;
      })
    );
  };

  const handleRemoveGroup = (productId) => {
    setItems((prevItems) =>
      prevItems.filter((group) => group.productId !== productId)
    );
    setSearchInputs((prevInputs) =>
      prevInputs.filter(
        (input) => !input.selected || input.selected.id !== productId
      )
    );
  };

  // --- Xử lý Submit ---
  const handleSubmit = async () => {
    if (!supplier) {
      toast.warn("Vui lòng chọn nhà cung cấp");
      return;
    }

    let dataToSubmit = [];
    items.forEach((group) => {
      const groupItems = (group.variants ?? [])
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          importPrice: item.importPrice,
        }));
      dataToSubmit = [...dataToSubmit, ...groupItems];
    });

    if (dataToSubmit.length === 0) {
      toast.warn("Vui lòng nhập số lượng cho ít nhất 1 biến thể");
      return;
    }

    for (const item of dataToSubmit) {
      if (item.importPrice < 0) {
        toast.warn(`Giá nhập phải >= 0`);
        return;
      }
    }

    try {
      await createGoodsReceipt({
        supplierId: supplier.id,
        items: dataToSubmit,
      });
      toast.success("Tạo phiếu nhập thành công");

      // GỌI CALLBACK THÀNH CÔNG ĐỂ TẢI LẠI DANH SÁCH CHA
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo phiếu nhập thất bại");
    }
  };

  // --- JSX Rendering ---
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Tạo Phiếu Nhập Kho</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mb={2}>
          {/* 1. Chọn nhà cung cấp */}
          <Autocomplete
            options={suppliers}
            getOptionLabel={(option) => option.name}
            value={supplier}
            onChange={(e, value) => setSupplier(value)}
            renderInput={(params) => (
              <TextField {...params} label="Nhà cung cấp" />
            )}
          />

          {/* 2. Danh sách ô tìm kiếm sản phẩm chính động */}
          <Typography variant="subtitle1" mt={2}>
            Thêm sản phẩm nhập
          </Typography>

          <Stack spacing={1}>
            {searchInputs.map((input) => {
              const isLastUnselectedInput =
                !input.selected &&
                input.id === searchInputs[searchInputs.length - 1].id;

              return (
                <Stack
                  key={input.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  {/* HIỂN THỊ KHI ĐÃ CHỌN SẢN PHẨM (TextField) */}
                  {input.selected ? (
                    <>
                      <TextField
                        value={input.selected.name}
                        label="Sản phẩm đã chọn"
                        fullWidth
                        disabled
                        size="small"
                        sx={{
                          flexGrow: 1,
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#333",
                            fontWeight: "bold",
                          },
                        }}
                      />
                      {/* Nút Xóa ô Input/Sản phẩm khỏi danh sách */}
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleRemoveSearchInput(input.id, input.selected.id)
                        }
                      >
                        <Delete />
                      </IconButton>
                      {/* Nút THÊM MỚI - Chỉ hiển thị khi đây là input cuối cùng */}
                      {input.id ===
                        searchInputs[searchInputs.length - 1].id && (
                        <Button
                          variant="outlined"
                          startIcon={<AddCircleOutline />}
                          onClick={handleAddNewSearchInput}
                          sx={{ whiteSpace: "nowrap", height: "56px" }}
                        >
                          Thêm mới
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* HIỂN THỊ KHI CHƯA CHỌN SẢN PHẨM (Autocomplete) */}
                      <Autocomplete
                        options={mainProductOptions.filter(
                          (opt) =>
                            !searchInputs.some(
                              (i) => i.selected && i.selected.id === opt.id
                            )
                        )}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) =>
                          handleSearchSelect(input.id, value)
                        }
                        sx={{ flexGrow: 1 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tìm kiếm và chọn Sản phẩm chính"
                          />
                        )}
                      />
                      {/* Nút THÊM MỚI - Chỉ hiển thị khi đang là ô tìm kiếm cuối cùng và chưa chọn */}
                      {isLastUnselectedInput && (
                        <Button
                          variant="outlined"
                          startIcon={<AddCircleOutline />}
                          onClick={handleAddNewSearchInput}
                          sx={{ whiteSpace: "nowrap", height: "56px" }}
                        >
                          Thêm mới
                        </Button>
                      )}
                    </>
                  )}
                </Stack>
              );
            })}
          </Stack>

          {/* 3. Danh sách biến thể được chia nhóm theo Sản phẩm chính (Table) */}
          <Typography variant="subtitle1" mt={2}>
            Danh sách Biến thể nhập
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "40%", pl: 3 }}>
                    Tên Biến thể
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    Ảnh
                  </TableCell>
                  <TableCell align="center" sx={{ width: "15%" }}>
                    Số lượng
                  </TableCell>
                  <TableCell align="center" sx={{ width: "25%" }}>
                    Giá nhập
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    Xóa
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="textSecondary" sx={{ py: 2 }}>
                        Chưa có sản phẩm nào được chọn.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {items.map((group, groupIndex) => (
                  <React.Fragment key={group.productId}>
                    {/* Hàng Tiêu đề nhóm (Sản phẩm chính) */}
                    <TableRow sx={{ backgroundColor: "#eef2ff" }}>
                      <TableCell colSpan={4}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          fontWeight="bold"
                        >
                          {group.productName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {/* Nút Xóa toàn bộ nhóm */}
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveGroup(group.productId)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {/* Các hàng biến thể của nhóm - Dùng ?? [] để tránh lỗi map */}
                    {(group.variants ?? []).map((item) => (
                      <TableRow
                        key={item.productVariantId}
                        sx={{
                          backgroundColor:
                            item.quantity > 0 ? "#f0faff" : "inherit",
                        }}
                      >
                        {/* Cột Tên Biến thể */}
                        <TableCell sx={{ pl: 3 }}>
                          <Typography variant="body2">
                            {item.productVariant.variantName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Tồn kho: {item.productVariant.stock} | Giá bán:{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.productVariant.price)}
                          </Typography>
                        </TableCell>

                        {/* Cột Ảnh */}
                        <TableCell align="center">
                          {item.productVariant.imageUrl && (
                            <img
                              src={item.productVariant.imageUrl}
                              alt="Biến thể"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </TableCell>

                        {/* Cột Số lượng */}
                        <TableCell align="center">
                          <TextField
                            type="number"
                            label="SL"
                            size="small"
                            value={item.quantity}
                            onChange={(e) =>
                              handleChangeItem(
                                group.productId,
                                item.productVariantId,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            inputProps={{ min: 0 }}
                            sx={{ maxWidth: "80px" }}
                          />
                        </TableCell>

                        {/* Cột Giá nhập */}
                        <TableCell align="center">
                          <TextField
                            type="number"
                            label="Giá nhập"
                            size="small"
                            value={item.importPrice}
                            onChange={(e) =>
                              handleChangeItem(
                                group.productId,
                                item.productVariantId,
                                "importPrice",
                                Number(e.target.value)
                              )
                            }
                            inputProps={{ min: 0 }}
                            sx={{ maxWidth: "120px" }}
                          />
                        </TableCell>

                        {/* Cột Xóa (chỉ xóa biến thể) */}
                        <TableCell align="center">-</TableCell>
                      </TableRow>
                    ))}
                    {/* Thêm đường kẻ phân cách giữa các nhóm (tùy chọn) */}
                    {groupIndex < items.length - 1 && (
                      <TableRow sx={{ "& > *": { borderBottom: "none" } }}>
                        <TableCell colSpan={5} sx={{ py: 0 }}>
                          <Divider />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Tạo phiếu nhập
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogPhieuNhap;
