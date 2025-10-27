import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import DialogCategory from "./DialogCategory";
const LIMIT_RECORD_PER_PAGE = 10;

export const CategoryManagement = () => {
  // ✅ Mock dữ liệu danh mục (hiển thị giả lập)
  const mockData = {
    data: [
      {
        _id: "1",
        name: "Điện thoại",
        description: "Các dòng smartphone mới nhất",
        createdAt: "2025-10-27",
      },
      {
        _id: "2",
        name: "Laptop",
        description: "Laptop văn phòng và gaming",
        createdAt: "2025-09-15",
      },
      {
        _id: "3",
        name: "Phụ kiện",
        description: "Phụ kiện điện thoại chính hãng",
        createdAt: "2025-08-05",
      },
    ],
    page: 1,
    total: 3,
  };

  const [data, setData] = useState(mockData);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [detailCategory, setDetailCategory] = useState(null);

  const handleOpenCategory = () => setIsOpenCategory(true);
  const handleChangePage = () => {};
  const handleGetList = () => {};

  // ✅ Xóa danh mục (chỉ thao tác trên mock data)
  const handleRemoveCategory = (id) => {
    const filtered = data.data.filter((item) => item._id !== id);
    setData({ ...data, data: filtered });
  };

  return (
    <div>
      <TableContainer>
        <div className="flex justify-end gap-3 pb-4">
          <Button variant="contained" onClick={handleOpenCategory}>
            Thêm
          </Button>
        </div>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">Tên danh mục</TableCell>
              <TableCell className="font-semibold">Mô tả</TableCell>
              <TableCell className="font-semibold">Thời gian tạo</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveCategory(item._id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data.data.length > 0 && (
        <div className="flex justify-between items-center px-3 py-5">
          <Pagination
            page={data.page}
            count={Math.ceil(data.total / LIMIT_RECORD_PER_PAGE)}
            shape="rounded"
            onChange={handleChangePage}
          />
        </div>
      )}
      <DialogCategory
        open={isOpenCategory}
        onClose={() => {
          setIsOpenCategory(false);
          setDetailCategory(null);
        }}
        onSuccess={() => handleGetList()}
        detailCategory={detailCategory}
      />
    </div>
  );
};
