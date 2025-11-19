import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import dayjs from "dayjs";
import BranDialog from "./BrandDialog";
import {
  fetchBrand,
  fetchTrashBrands,
  removeBrand,
  restoreBrand,
} from "../../../services/brand-managment";
import { toast } from "react-toastify";

export default function BrandManagement() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailBrand, setBrand] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let res;
      if (currentTab === 0) {
        res = await fetchBrand();
      } else {
        res = await fetchTrashBrands();
      }
      setData(res || []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const handleOpenDialog = (brand = null) => {
    setBrand(brand);
    setIsDialogOpen(true);
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn chuyển vào thùng rác?")) return;
    try {
      const res = await removeBrand(id);
      if (res.status === 200 || res.status === 204) {
        toast.success("Đã chuyển vào thùng rác thành công!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await restoreBrand(id);
      if (res.status === 200) {
        toast.success("Khôi phục thành công! 🎉");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi khôi phục.");
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Quản lý thương hiệu
      </Typography>

      <div className="flex justify-between items-center pb-4">
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
          <Tab label="Danh sách hiện có" />
          <Tab label="Thùng rác" />
        </Tabs>

        {currentTab === 0 && (
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Thêm thương hiệu
          </Button>
        )}
      </div>

      <Divider />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* ĐÃ XÓA CỘT LOGO Ở ĐÂY */}
              <TableCell>Tên thương hiệu</TableCell>
              <TableCell>
                {currentTab === 0 ? "Ngày tạo" : "Ngày xóa"}
              </TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((brand) => (
                <TableRow key={brand.id}>
                  {/* ĐÃ XÓA CỘT ẢNH LOGO Ở ĐÂY */}

                  <TableCell>{brand.name}</TableCell>

                  <TableCell>
                    {dayjs(
                      currentTab === 0 ? brand.createdAt : brand.deletedAt
                    ).format("DD/MM/YYYY")}
                  </TableCell>

                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      {currentTab === 0 ? (
                        <>
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
                        </>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleRestore(brand.id)}
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
                <TableCell colSpan={3} align="center">
                  {isLoading ? "Đang tải..." : "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <BranDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => fetchData()}
        detailBrand={detailBrand}
      />
    </div>
  );
}
