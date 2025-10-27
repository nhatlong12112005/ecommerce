import React, { useState } from "react";
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
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { formatBigNumber } from "../../../libs/utils/format-big-number";

import anh from "../../../assets/iphone-17-pro-black.png";

const LIMIT_RECORD_PER_PAGE = 10;

export const ProductManagement = () => {
  const navigate = useNavigate();

  // ✅ Mock dữ liệu sản phẩm
  const mockData = {
    data: [
      {
        _id: "1",
        name: "iPhone 15 Pro Max",
        category: "Điện thoại",
        images: [anh],
        price: 33990000,
        quantity: 12,
        description:
          "Điện thoại cao cấp nhất của Apple, chip A17 Pro, khung titan.",
        createdAt: "2025-10-25T10:00:00Z",
      },
      {
        _id: "2",
        name: "Samsung Galaxy S24 Ultra",
        category: "Điện thoại",
        images: [
          "https://cdn.tgdd.vn/Products/Images/42/301641/samsung-galaxy-s24-ultra-titanium-black-thumbnew-600x600.jpg",
        ],
        price: 29990000,
        quantity: 8,
        description:
          "Flagship mạnh mẽ của Samsung, bút S-Pen, camera zoom 10x.",
        createdAt: "2025-10-24T12:30:00Z",
      },
      {
        _id: "3",
        name: "MacBook Air M3 2024",
        category: "Laptop",
        images: [
          "https://cdn.tgdd.vn/Products/Images/44/324102/macbook-air-m3-2024-13-inch-starlight-thumb-600x600.jpg",
        ],
        price: 28990000,
        quantity: 7,
        description: "Laptop Apple M3 hiệu năng mạnh, thiết kế mỏng nhẹ.",
        createdAt: "2025-10-15T09:00:00Z",
      },
      {
        _id: "4",
        name: "iPad Pro M2 12.9 inch",
        category: "Máy tính bảng",
        images: [
          "https://cdn.tgdd.vn/Products/Images/522/264063/ipad-pro-m2-129-silver-thumb-600x600.jpg",
        ],
        price: 34990000,
        quantity: 5,
        description: "Máy tính bảng chuyên nghiệp, màn hình Liquid Retina XDR.",
        createdAt: "2025-10-10T14:15:00Z",
      },
      {
        _id: "5",
        name: "AirPods Pro 2 USB-C",
        category: "Phụ kiện",
        images: [
          "https://cdn.tgdd.vn/Products/Images/54/306208/tai-nghe-airpods-pro-2-type-c-thumb-600x600.jpg",
        ],
        price: 5990000,
        quantity: 25,
        description: "Tai nghe chống ồn chủ động, sạc USB-C, chip H2.",
        createdAt: "2025-09-30T16:45:00Z",
      },
    ],
    page: 1,
    total: 5,
  };

  const [data, setData] = useState(mockData);
  const [filters, setFilters] = useState({ name: "", category: "", date: "" });

  // ✅ Lọc dữ liệu theo bộ lọc
  const filteredProducts = data.data.filter((item) => {
    const matchName = item.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const matchCategory = filters.category
      ? item.category === filters.category
      : true;
    const matchDate = filters.date
      ? dayjs(item.createdAt).isSame(filters.date, "day")
      : true;
    return matchName && matchCategory && matchDate;
  });

  const [page, setPage] = useState(1);
  const handleChangePage = (event, value) => setPage(value);

  const handleAddProduct = () => {
    navigate("add");
  };

  // ✅ Hàm xóa sản phẩm (chỉ thao tác trên mock data)
  const handleDelete = (id) => {
    const filtered = data.data.filter((item) => item._id !== id);
    setData({ ...data, data: filtered });
  };

  return (
    <div>
      {/* ✅ Thanh lọc nằm ngay cạnh "Thêm sản phẩm" */}
      <div className="flex flex-wrap justify-between gap-3 pb-4 items-center">
        <div className="flex gap-3 flex-wrap items-center">
          <TextField
            label="Tìm theo tên"
            variant="outlined"
            size="small"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <TextField
            label="Danh mục"
            select
            variant="outlined"
            size="small"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            style={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Điện thoại">Điện thoại</MenuItem>
            <MenuItem value="Laptop">Laptop</MenuItem>
            <MenuItem value="Máy tính bảng">Máy tính bảng</MenuItem>
            <MenuItem value="Phụ kiện">Phụ kiện</MenuItem>
          </TextField>
          <TextField
            label="Ngày tạo"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <Button variant="contained" onClick={handleAddProduct}>
          Thêm sản phẩm
        </Button>
      </div>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">Tên sản phẩm</TableCell>
              <TableCell className="font-semibold">Hình ảnh</TableCell>
              <TableCell className="font-semibold">Giá</TableCell>
              <TableCell className="font-semibold">Số lượng</TableCell>
              <TableCell className="font-semibold">Danh mục</TableCell>
              <TableCell className="font-semibold">Mô tả</TableCell>
              <TableCell className="font-semibold">Thời gian tạo</TableCell>
              <TableCell className="font-semibold">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  </TableCell>
                  <TableCell>{formatBigNumber(item.price, true)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="truncate w-56">{item.description}</div>
                  </TableCell>
                  <TableCell>
                    {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => navigate(`edit/${item._id}`)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item._id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {data.data.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <div className="text-sm">
            Hiển thị {filteredProducts.length} sản phẩm
          </div>
          <Pagination
            page={data.page}
            count={Math.ceil(data.total / LIMIT_RECORD_PER_PAGE)}
            shape="rounded"
            onChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
};
