// Auth
export const API_REGISTER = "/users/signup";
export const API_LOGIN = "/auth/sign-in";

// Category
export const API_CREATE_CATEGORY = "/product/categories";
export const API_GET_LIST_CATEGORY = "/product/categories";
export const API_REMOVE_CATEGORY = "/product/:id/categories";
import phoneImg from "../assets/iphone-17-pro.png";
import pro2 from "../assets/iphone-17-pro-black.png";
import laptopImg from "../assets/mac-book.jpeg"; // Thêm ảnh cho laptop

// Đảm bảo bạn có các import ảnh này ở đầu file, hoặc thay bằng đường dẫn đúng của bạn
// Ví dụ:
// import phoneImg from "./assets/iphone-17-pro.png";
// import pro2 from "./assets/iphone-17-pro-black.png";
// import pro3 from "./assets/iphone-17-pro-blue.png";
// import laptopImg from "./assets/macbook-pro.png";

export const database = {
  phones: {
    categoryName: "Điện thoại di động",
    filters: {
      brands: ["All", "iPhone", "Samsung", "Google", "Xiaomi", "Oppo"],
    },
    products: [
      {
        id: "p1",
        name: "iPhone 17 Pro Max",
        price: 70000000,
        brand: "iPhone",
        // >> THÊM DỮ LIỆU CHI TIẾT
        images: [phoneImg, pro2], // Dùng các import ảnh đã có
        description:
          "Trải nghiệm đỉnh cao công nghệ với chip A19 Bionic mạnh mẽ, màn hình ProMotion 120Hz siêu mượt.",
        options: {
          colors: ["Natural Titan", "Black Titan", "Blue Titan"],
          storage: ["256GB", "512GB", "1TB"],
        },
        // << KẾT THÚC THÊM DỮ LIỆU CHI TIẾT
        image: phoneImg,
      },
      {
        id: "p2",
        name: "Samsung Galaxy S25 Ultra",
        price: 65000000,
        brand: "Samsung",
        // >> THÊM DỮ LIỆU CHI TIẾT
        images: [phoneImg],
        description:
          "Vua nhiếp ảnh di động với camera 200MP và bút S Pen tích hợp.",
        options: {
          colors: ["Phantom Black", "Cream"],
          storage: ["256GB", "512GB"],
        },
        // << KẾT THÚC THÊM DỮ LIỆU CHI TIẾT
        image: phoneImg,
      },
      // ...
    ],
  },
  laptops: {
    categoryName: "Máy tính xách tay",
    filters: {
      brands: ["All", "Apple", "Dell", "HP", "Asus", "Lenovo"],
    },
    products: [
      {
        id: "l1",
        name: "MacBook Pro M4 16-inch",
        price: 85000000,
        brand: "Apple",
        // >> THÊM DỮ LIỆU CHI TIẾT
        images: [laptopImg],
        description:
          "Hiệu năng đột phá cho các chuyên gia sáng tạo với chip M4.",
        options: {
          colors: ["Space Black", "Silver"],
          storage: ["512GB", "1TB", "2TB"],
        },
        // << KẾT THÚC THÊM DỮ LIỆU CHI TIẾT
        image: laptopImg,
      },
      {
        id: "l2",
        name: "Dell XPS 15",
        price: 55000000,
        brand: "Dell",
        // >> THÊM DỮ LIỆU CHI TIẾT
        images: [laptopImg],
        description: "Màn hình vô cực tuyệt đẹp và thiết kế mỏng nhẹ.",
        options: {
          colors: ["Platinum Silver"],
          storage: ["256GB", "512GB"],
        },
        // << KẾT THÚC THÊM DỮ LIỆU CHI TIẾT
        image: laptopImg,
      },
      {
        id: "l3",
        name: "HP Spectre x360",
        price: 48000000,
        brand: "HP",
        // >> THÊM DỮ LIỆU CHI TIẾT
        images: [laptopImg],
        description: "Thiết kế xoay gập 360 độ linh hoạt và bút cảm ứng.",
        options: {
          colors: ["Nightfall Black"],
          storage: ["512GB", "1TB"],
        },
        // << KẾT THÚC THÊM DỮ LIỆU CHI TIẾT
        image: laptopImg,
      },
      // ...
    ],
  },
};
