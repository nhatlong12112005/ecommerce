import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Autocomplete,
  TextField,
  Box,
  Stack,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { toast } from "react-toastify";

// --- Import hook và service thật ---
import useGetListSupplier from "../../../hooks/useGetListSupplier";
import { createGoodsReceiptFromFile } from "../../../services/goodsReceip";

const PhieuNhap = () => {
  const { data: suppliers, isLoading: isLoadingSuppliers } =
    useGetListSupplier();

  const [supplier, setSupplier] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form
  const resetForm = () => {
    setSupplier(null);
    setUploadedFile(null);
  };

  // Chọn file
  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    console.log("File đã chọn:", file); // Debug để chắc chắn
    setUploadedFile(file);
  };

  // Gửi file
  const handleSubmitFile = async () => {
    if (!supplier || !uploadedFile) {
      toast.warn("Vui lòng chọn nhà cung cấp và file Excel.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gọi service: FormData + multipart/form-data
      const response = await createGoodsReceiptFromFile(
        uploadedFile,
        supplier.id
      );
      console.log("Response server:", response.data);
      toast.success("Upload và nhập kho thành công!");
      resetForm();
    } catch (err) {
      console.error("Lỗi khi upload file:", err);
      toast.error(err.response?.data?.message || "Upload thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      {isSubmitting && (
        <LinearProgress
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
        />
      )}

      <Typography variant="h4" component="h1" gutterBottom>
        Tạo Phiếu Nhập Kho (Upload File)
      </Typography>

      {/* Chọn nhà cung cấp */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Autocomplete
          options={suppliers}
          getOptionLabel={(option) => option.name}
          value={supplier}
          onChange={(event, newValue) => setSupplier(newValue)}
          loading={isLoadingSuppliers}
          disabled={isSubmitting}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Chọn Nhà Cung Cấp (Bắt buộc)"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingSuppliers ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Paper>

      {/* Upload file */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6">1. Tải file mẫu</Typography>
          <Button
            variant="outlined"
            component="a"
            href="/excel-template/phieu-nhap-mau.xlsx"
            download
          >
            Tải về file mẫu (.xlsx)
          </Button>
          <Typography variant="body2" align="center" sx={{ maxWidth: 450 }}>
            File upload phải chứa 3 cột: <strong>productVariantId</strong>,{" "}
            <strong>quantity</strong>, và <strong>importPrice</strong>.
          </Typography>

          <Box sx={{ height: "16px" }} />

          <Typography variant="h6">2. Chọn file để upload</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Chọn File Excel
            <input
              type="file"
              hidden
              accept=".xlsx, .csv"
              onChange={handleFileChange}
            />
          </Button>

          {uploadedFile && (
            <Typography variant="body1" color="primary">
              Đã chọn file: {uploadedFile.name} ({uploadedFile.size} bytes)
            </Typography>
          )}

          <Box sx={{ height: "16px" }} />

          <Typography variant="h6">3. Tải lên & Nhập kho</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmitFile}
            disabled={!supplier || !uploadedFile || isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Tải Lên & Nhập Kho"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PhieuNhap;
