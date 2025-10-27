import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import deleteProduct from "../../../assets/deleteProduct.png";
import { removeProduct } from "../../../services/product-management";
import { toast } from "react-toastify";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DialogRemoveProduct({ productId, onClose, onSuccess }) {
  const handleClose = () => {
    onClose();
  };
  // removeProduct

  const handleRemoveProduct = async () => {
    const res = await removeProduct(productId);
    console.log(res, "resresresres");
    if (res.status === 204) {
      onSuccess();
      toast.success("Xóa thành công", {
        autoClose: 500,
      });
      handleClose();
    }
  };
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={!!productId}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "500px",
              maxWidth: "500px", // Set your width here
              borderRadius: "12px",
            },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Bạn có muốn xóa sản phẩm hay không ?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="flex justify-center">
            <img src={deleteProduct} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className="!bg-red-600"
            onClick={handleRemoveProduct}
          >
            Xóa
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
