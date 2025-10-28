import React, { useState, useMemo } from "react";
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
  TextField, // Thêm TextField để dùng cho Select
  MenuItem, // Thêm MenuItem cho các lựa chọn trong Select
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterListIcon from "@mui/icons-material/FilterList";

import SalesDetailDialog from "./SalesDetailDialog";

// Dữ liệu mock
const mockSalesData = [
  {
    product: {
      name: "iPhone 17 Pro Max",
      category: "Điện thoại",
      price: 33990000,
    },
    quantity: 70,
    date: "2025-10-05",
  },
  {
    product: {
      name: "Samsung Galaxy S26 Ultra",
      category: "Điện thoại",
      price: 31990000,
    },
    quantity: 25,
    date: "2025-10-08",
  },
  {
    product: {
      name: "MacBook Pro M5 14-inch",
      category: "Laptop",
      price: 52990000,
    },
    quantity: 35,
    date: "2025-10-12",
  },
  {
    product: { name: "AirPods Pro 3", category: "Phụ kiện", price: 6490000 },
    quantity: 180,
    date: "2025-09-15",
  },
  {
    product: { name: "AirPods Pro 3", category: "Phụ kiện", price: 6490000 },
    quantity: 100,
    date: "2025-10-15",
  },
  {
    product: { name: "iPad Air 6", category: "Máy tính bảng", price: 18990000 },
    quantity: 20,
    date: "2025-10-20",
  },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );
// Lấy danh sách các loại sản phẩm duy nhất từ dữ liệu
const categories = [
  ...new Set(mockSalesData.map((item) => item.product.category)),
];

export default function Dashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ State cho bộ lọc loại sản phẩm

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  const { revenueByCategory, quantityByCategory, topSellingProducts } =
    useMemo(() => {
      const filteredSales = mockSalesData.filter((sale) => {
        // Lọc theo ngày
        const saleDate = dayjs(sale.date);
        if (startDate && saleDate.isBefore(startDate, "day")) return false;
        if (endDate && saleDate.isAfter(endDate, "day")) return false;

        // ✅ Lọc theo loại sản phẩm
        if (selectedCategory && sale.product.category !== selectedCategory)
          return false;

        return true;
      });

      const stats = { revenue: {}, quantity: {}, products: {} };
      filteredSales.forEach((sale) => {
        const { category, name, price } = sale.product;
        const saleRevenue = price * sale.quantity;
        stats.revenue[category] = (stats.revenue[category] || 0) + saleRevenue;
        stats.quantity[category] =
          (stats.quantity[category] || 0) + sale.quantity;
        if (!stats.products[name]) {
          stats.products[name] = {
            name,
            category,
            sold: 0,
            revenue: 0,
            salesHistory: [],
          };
        }
        stats.products[name].sold += sale.quantity;
        stats.products[name].revenue += saleRevenue;
        stats.products[name].salesHistory.push({
          date: sale.date,
          quantity: sale.quantity,
        });
      });

      const revenueByCategory = Object.keys(stats.revenue)
        .map((name) => ({ name, "Doanh thu": stats.revenue[name] }))
        .sort((a, b) => b["Doanh thu"] - a["Doanh thu"]);
      const quantityByCategory = Object.keys(stats.quantity).map((name) => ({
        name,
        value: stats.quantity[name],
      }));
      const topSellingProducts = Object.values(stats.products).sort(
        (a, b) => b.sold - a.sold
      );

      return { revenueByCategory, quantityByCategory, topSellingProducts };
    }, [startDate, endDate, selectedCategory]); // ✅ Thêm selectedCategory vào dependency

  const handleResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCategory(""); // ✅ Reset bộ lọc loại
  };

  const handleOpenDetails = (product) => {
    setSelectedProductDetails(product);
    setIsDetailOpen(true);
  };
  const handleCloseDetails = () => setIsDetailOpen(false);

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

        <Card sx={{ mb: 3, boxShadow: 1, border: "1px solid #e0e0e0" }}>
          <CardHeader avatar={<FilterListIcon />} title="Bộ lọc thống kê" />
          <CardContent>
            <Grid container spacing={2} alignItems="center">
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
              {/* ✅ Thêm bộ lọc loại sản phẩm */}
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  select
                  label="Loại sản phẩm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Tất cả</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid>
                <Button variant="text" onClick={handleResetFilter}>
                  Xóa bộ lọc
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Khu vực nội dung chính */}
        <Grid container spacing={3}>
          <Grid xs={12} lg={6}>
            <Card sx={{ boxShadow: 3, height: "100%" }}>
              <CardHeader
                avatar={<PieChartIcon color="primary" />}
                title="Tỷ lệ sản phẩm đã bán"
              />
              <CardContent>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={quantityByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                      >
                        {quantityByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} sản phẩm`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} lg={6}>
            <Card sx={{ boxShadow: 3, height: "100%" }}>
              <CardHeader
                avatar={<BarChartIcon color="primary" />}
                title="Doanh thu theo loại sản phẩm"
              />
              <CardContent>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueByCategory}
                      margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis
                        fontSize={12}
                        tickFormatter={(value) => `${value / 1000000}M`}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="Doanh thu" fill="#3366FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

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
                      <TableCell sx={{ fontWeight: "bold" }} align="center">
                        Hành động
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topSellingProducts.length > 0 ? (
                      topSellingProducts.map((product) => (
                        <TableRow key={product.name} hover>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell align="right">{product.sold}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500 }}>
                            {formatCurrency(product.revenue)}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenDetails(product)}
                            >
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
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
      <SalesDetailDialog
        open={isDetailOpen}
        onClose={handleCloseDetails}
        product={selectedProductDetails}
      />
    </LocalizationProvider>
  );
}
