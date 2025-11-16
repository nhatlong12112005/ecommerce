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
  Typography,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import BranDialog from "./BrandDialog";
import useGetListBrand from "../../../hooks/useGetListBrand";
import { removeBrand } from "../../../services/brand-managment";

export default function BrandManagement() {
  const { data, handleGetList, isLoading } = useGetListBrand();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailBrand, setBrand] = useState(null);

  const handleOpenDialog = (brand = null) => {
    setBrand(brand);
    setIsDialogOpen(true);
  };
  const handleRemove = async (id) => {
    try {
      const res = await removeBrand(id);
      if (res.status === 204) handleGetList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý thương hiệu
      </Typography>

      <div className="flex flex-wrap justify-end gap-3 pb-4 items-center">
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm nhà cung cấp
        </Button>
      </div>

      <Divider />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 80 }}>Logo</TableCell>
              <TableCell>Tên thương hiệu</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain", // Giữ tỷ lệ ảnh
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>

                  <TableCell>
                    {dayjs(brand.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(brand)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemove(brand.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {isLoading ? "Đang tải..." : "Không tìm thấy danh mục nào"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <BranDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => handleGetList()}
        detailBrand={detailBrand}
      />
    </div>
  );
}
