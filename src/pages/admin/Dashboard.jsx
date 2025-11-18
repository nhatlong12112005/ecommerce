import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterListIcon from "@mui/icons-material/FilterList";

import { getDashboardStatistics } from "../../services/statistics";

export default function Dashboard() {
  // --- STATE API ---
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  // --- FILTERS ---
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  // // Danh sách category
  // const categories = useMemo(() => {
  //   return revenueByCategory.map((x) => x.name);
  // }, [revenueByCategory]);

  // --- SỬA GIAO DIỆN (SỐ 2) ---
  // Money format (cho Bảng và Tooltip)
  const formatCurrency = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Axis format (cho trục Y của biểu đồ)
  const formatAxis = (tick) => tick?.toLocaleString("vi-VN");
  // --- KẾT THÚC SỬA GIAO DIỆN ---

  // --- API Fetch (SỬA LOGIC DỮ LIỆU - SỐ 1) ---
  const fetchDashboard = async () => {
    try {
      const params = {};

      if (startDate) params.fromDate = startDate.toISOString();
      if (endDate) params.toDate = endDate.toISOString();
      if (selectedCategory) params.category = selectedCategory;

      const res = await getDashboardStatistics(params);

      // --- Dữ liệu gốc từ API ---
      const revenueFromApi = Array.isArray(res.revenueByCategory)
        ? res.revenueByCategory
        : [];
      const topProductsFromApi = Array.isArray(res.topSellingProducts)
        ? res.topSellingProducts
        : [];
      const customersFromApi = Array.isArray(res.topCustomers)
        ? res.topCustomers
        : [];

      // --- 1. Xử lý Top Selling Products (Vẫn giữ nguyên) ---
      const mappedTopProducts = topProductsFromApi.map((item) => ({
        name: item.productName,
        category: item.categoryName,
        sold: Number(item.totalSold),
        revenue: Number(item.totalRevenue),
      }));
      setTopSellingProducts(mappedTopProducts);

      // --- 2. Xử lý Top Customers (Vẫn giữ nguyên) ---
      setTopCustomers(
        customersFromApi.map((item) => ({
          customerId: item.userId,
          name: item.userName,
          totalSpent: Number(item.totalSpent),
        }))
      );

      // --- 3. [PHẦN SỬA LẠI] Tính toán lại Revenue By Category ---
      // Tự tính tổng doanh thu từ 'mappedTopProducts'
      // vì 'res.revenueByCategory' từ API đang trả về 3tr (sai)

      const calculatedRevenueMap = new Map();

      // Lấy dữ liệu từ top products (vì nó có vẻ đúng - 50tr)
      mappedTopProducts.forEach((product) => {
        const currentRevenue = calculatedRevenueMap.get(product.category) || 0;
        calculatedRevenueMap.set(
          product.category,
          currentRevenue + product.revenue
        );
      });

      // Lấy các danh mục khác từ API (nếu có)
      // mà không xuất hiện trong top products
      revenueFromApi.forEach((apiCategory) => {
        const categoryName = apiCategory.categoryName;
        // Chỉ thêm nếu danh mục này chưa được tính từ top products
        if (!calculatedRevenueMap.has(categoryName)) {
          calculatedRevenueMap.set(
            categoryName,
            Number(apiCategory.totalRevenue)
          );
        }
      });

      // Chuyển Map thành mảng mà Recharts có thể đọc
      const finalRevenueData = [];
      for (const [name, revenue] of calculatedRevenueMap.entries()) {
        finalRevenueData.push({
          name: name,
          DoanhThu: revenue,
        });
      }

      // Set state cho biểu đồ bằng dữ liệu đã tính toán lại
      setRevenueByCategory(finalRevenueData);
      // --- [KẾT THÚC PHẦN SỬA DỮ LIỆU] ---
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
      // Set mảng rỗng nếu có lỗi
      setRevenueByCategory([]);
      setTopSellingProducts([]);
      setTopCustomers([]);
    }
  };
  // --- KẾT THÚC SỬA LOGIC API ---

  // Auto load when filter changes
  useEffect(() => {
    fetchDashboard();
  }, [startDate, endDate, selectedCategory]);

  const handleResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCategory("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#172B4D" }}
        >
          Bảng điều khiển Thống kê
        </Typography>

        {/* BỘ LỌC */}
        <Card sx={{ mb: 3, boxShadow: 1 }}>
          <CardHeader avatar={<FilterListIcon />} title="Bộ lọc thống kê" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} sm={4} md={3}>
                <DatePicker
                  label="Từ ngày"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>

              <Grid xs={12} sm={4} md={3}>
                <DatePicker
                  label="Đến ngày"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>

              <Grid>
                <Button variant="text" onClick={handleResetFilter}>
                  Xóa bộ lọc
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* --- Doanh thu theo loại --- */}
        <Grid container spacing={3}>
          <Grid xs={12} lg={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardHeader
                avatar={<BarChartIcon color="primary" />}
                title="Doanh thu theo loại sản phẩm"
              />
              <CardContent>
                <Box sx={{ height: 350, width: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart margin={{ left: 50 }} data={revenueByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />

                      <YAxis tickFormatter={formatAxis} />
                      {/* --- KẾT THÚC SỬA GIAO DIỆN --- */}

                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="DoanhThu" fill="#3366FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* --- Top sản phẩm --- */}
          <Grid xs={12}>
            <Card sx={{ boxShadow: 3 }}>
              <CardHeader
                avatar={<TrendingUpIcon color="primary" />}
                title="Sản phẩm bán chạy"
              />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tên sản phẩm
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Loại</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Đã bán
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Tổng doanh thu
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {topSellingProducts.length > 0 ? (
                      topSellingProducts.map((p) => (
                        <TableRow key={p.name} hover>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.category}</TableCell>
                          <TableCell align="right">{p.sold}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(p.revenue)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* --- Top khách hàng --- */}
          <Grid xs={12}>
            <Card sx={{ boxShadow: 3 }}>
              <CardHeader
                avatar={<TrendingUpIcon color="secondary" />}
                title="Top 5 khách hàng mua nhiều nhất"
              />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Khách hàng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Tổng tiền đã mua
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {topCustomers.length > 0 ? (
                      topCustomers.map((c) => (
                        <TableRow key={c.customerId} hover>
                          <TableCell>{c.name}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(c.totalSpent)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}
