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
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import ProductDialog from "./ProductDialog";
import ColorGroupListDialog from "./ColorGroupListDialog";
import useGetListProduct from "../../../hooks/useGetListProduct";
import useGetListCategory from "../../../hooks/useGetListCategory";
import useGetListBrand from "../../../hooks/useGetListBrand";
import useDebounce from "../../../hooks/useDebounce";
import { deleteProduct } from "../../../services/product-management";

const LIMIT_RECORD_PER_PAGE = 10;

export default function ProductManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  // ProductDialog state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);

  // Variant dialog state
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: brands = [] } = useGetListBrand();
  const { data: categories = [] } = useGetListCategory();

  // Reset page khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, brand, category]);

  const {
    data: products,
    total,
    isLoading,
    handleGetList,
  } = useGetListProduct({
    page,
    limit: LIMIT_RECORD_PER_PAGE,
    search: debouncedSearch,
    brandId: brand,
    categoryId: category,
  });

  const handleChangePage = (e, value) => setPage(value);

  // =================== ProductDialog ===================
  const handleOpenProductDialog = (product = null) => {
    setDetailProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleCloseProductDialog = () => {
    setDetailProduct(null);
    setIsProductDialogOpen(false);
  };

  const handleProductSuccess = () => {
    handleGetList();
    handleCloseProductDialog();
  };

  // =================== VariantDialog ===================
  const handleOpenVariantDialog = (product) => {
    setSelectedProduct(product);
    setIsVariantDialogOpen(true);
  };

  const handleCloseVariantDialog = () => {
    setSelectedProduct(null);
    setIsVariantDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa sản phẩm này? (Toàn bộ biến thể cũng sẽ bị xóa)"
      )
    ) {
      try {
        await deleteProduct(id);
        handleGetList();
      } catch (error) {
        console.error("Xóa sản phẩm thất bại:", error);
      }
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      {/* Bộ lọc */}
      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex flex-wrap gap-3 items-center">
          <TextField
            label="Tìm theo tên sản phẩm"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 200 }}
          />
          <TextField
            label="Danh mục"
            size="small"
            select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cte) => (
              <MenuItem key={cte.id} value={cte.id}>
                {cte.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Thương hiệu"
            size="small"
            select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {brands.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Button variant="contained" onClick={() => handleOpenProductDialog()}>
          Thêm sản phẩm
        </Button>
      </div>

      <Divider />

      {/* Bảng sản phẩm */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Quản lý Biến thể</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || "N/A"}</TableCell>
                  <TableCell>{product.brand?.name || "N/A"}</TableCell>
                  <TableCell>
                    {dayjs(product.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenVariantDialog(product)}
                    >
                      Quản lý
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenProductDialog(product)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(product.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {isLoading ? "Đang tải..." : "Không tìm thấy sản phẩm nào"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {products.length} / {total} sản phẩm
          </div>
          <Pagination
            page={page}
            count={Math.ceil(total / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
          />
        </div>
      )}

      {/* ProductDialog */}
      <ProductDialog
        open={isProductDialogOpen}
        onClose={handleCloseProductDialog}
        onSuccess={handleProductSuccess}
        detailProduct={detailProduct}
      />

      {/* ProductVariantListDialog */}
      <ColorGroupListDialog
        open={isVariantDialogOpen}
        onClose={handleCloseVariantDialog}
        product={selectedProduct}
      />
    </div>
  );
}
