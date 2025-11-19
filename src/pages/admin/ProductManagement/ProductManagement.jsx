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
  Tabs, // Thêm Tabs
  Tab, // Thêm Tab
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { toast } from "react-toastify"; // Import Toast

// Component con
import ProductDialog from "./ProductDialog";
import ColorGroupListDialog from "./ColorGroupListDialog";

// Hook & Service
import useGetListCategory from "../../../hooks/useGetListCategory";
import useGetListBrand from "../../../hooks/useGetListBrand";
import useDebounce from "../../../hooks/useDebounce";
import {
  getProducts,
  getTrashProducts, // Mới
  deleteProduct,
  restoreProduct, // Mới
} from "../../../services/product-management";

const LIMIT_RECORD_PER_PAGE = 10;

export default function ProductManagement() {
  // State dữ liệu
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // State bộ lọc
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // State Tab (0: List, 1: Trash)
  const [currentTab, setCurrentTab] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  // State Dialog
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Lấy danh sách Category/Brand cho bộ lọc
  const { data: categories } = useGetListCategory();
  const { data: brands } = useGetListBrand();

  // --- HÀM TẢI DỮ LIỆU ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (currentTab === 0) {
        // === TAB DANH SÁCH (Có phân trang & lọc) ===
        const params = {
          page,
          limit: LIMIT_RECORD_PER_PAGE,
          search: debouncedSearch,
          brandId: brandId || undefined,
          categoryId: categoryId || undefined,
        };
        const res = await getProducts(params);
        // Backend trả về: { data, totalItems, ... }
        setProducts(res.data.data || []);
        setTotal(res.data.totalItems || 0);
      } else {
        // === TAB THÙNG RÁC (Hiện chưa phân trang bên BE, trả về mảng) ===
        const res = await getTrashProducts();
        setProducts(res || []);
        setTotal(res.length || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi lại khi các điều kiện thay đổi
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, brandId, categoryId, currentTab]);

  // Khi đổi Tab thì reset page về 1
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(1);
    // Reset bộ lọc nếu muốn (tuỳ chọn)
    // setSearch(""); setBrandId(""); setCategoryId("");
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // --- XỬ LÝ DIALOG ---
  const handleOpenProductDialog = (product = null) => {
    setDetailProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleOpenVariantDialog = (product) => {
    setSelectedProduct(product);
    setIsVariantDialogOpen(true);
  };

  // --- XỬ LÝ XÓA (Đưa vào thùng rác) ---
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn chuyển sản phẩm này vào thùng rác?"
      )
    )
      return;

    try {
      const res = await deleteProduct(id);
      // Backend trả về 200
      if (res.status === 200 || res.status === 204) {
        toast.success("Đã chuyển vào thùng rác thành công!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    }
  };

  // --- XỬ LÝ KHÔI PHỤC ---
  const handleRestore = async (id) => {
    try {
      const res = await restoreProduct(id);
      if (res.status === 200) {
        toast.success("Khôi phục sản phẩm thành công! 🎉");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi khôi phục sản phẩm.");
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      {/* --- BỘ LỌC & TABS --- */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <Tabs value={currentTab} onChange={handleChangeTab}>
            <Tab label="Danh sách sản phẩm" />
            <Tab label="Thùng rác" />
          </Tabs>

          {currentTab === 0 && (
            <Button
              variant="contained"
              onClick={() => handleOpenProductDialog()}
            >
              Thêm sản phẩm
            </Button>
          )}
        </div>

        {/* Chỉ hiện bộ lọc ở Tab Danh sách */}
        {currentTab === 0 && (
          <div className="flex gap-3 flex-wrap">
            <TextField
              label="Tìm kiếm tên sản phẩm..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />

            <TextField
              select
              label="Danh mục"
              size="small"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories?.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Thương hiệu"
              size="small"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {brands?.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}
      </div>

      <Divider sx={{ mb: 2 }} />

      {/* --- BẢNG DỮ LIỆU --- */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>
                {currentTab === 0 ? "Ngày tạo" : "Ngày xóa"}
              </TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || "N/A"}</TableCell>
                  <TableCell>{product.brand?.name || "N/A"}</TableCell>
                  <TableCell>
                    {dayjs(
                      currentTab === 0 ? product.createdAt : product.deletedAt
                    ).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      {currentTab === 0 ? (
                        // === TAB DANH SÁCH ===
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleOpenVariantDialog(product)}
                          >
                            Biến thể
                          </Button>
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
                        </>
                      ) : (
                        // === TAB THÙNG RÁC ===
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRestore(product.id)}
                        >
                          Khôi phục
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - Chỉ hiện khi có dữ liệu và ở Tab Danh sách */}
      {products.length > 0 && currentTab === 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {products.length} / {total} sản phẩm
          </div>
          <Pagination
            page={page}
            // Tính tổng số trang dựa trên totalItems backend trả về
            count={Math.ceil(total / LIMIT_RECORD_PER_PAGE)}
            onChange={handleChangePage}
            color="primary"
          />
        </div>
      )}

      {/* Dialog Thêm/Sửa */}
      <ProductDialog
        open={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onSuccess={() => fetchData()} // Load lại dữ liệu sau khi lưu
        detailProduct={detailProduct}
      />

      {/* Dialog Quản lý Biến thể/Màu sắc */}
      <ColorGroupListDialog
        open={isVariantDialogOpen}
        onClose={() => setIsVariantDialogOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
