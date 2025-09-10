# Biểu Ghi Chép QC Tấm Bộ Phận O-ring

Ứng dụng web form nhập liệu QC O-ring được thiết kế đặc biệt cho tablet, thay thế cho việc ghi chép thủ công trên giấy.

## Tính năng chính

### 📝 Nhập liệu dễ dàng
- Form responsive tối ưu cho tablet
- Giao diện thân thiện với touch screen
- Tự động lưu dữ liệu khi nhập
- Validation dữ liệu thông minh

### 📊 Quản lý dữ liệu
- Thêm/sửa/xóa dòng dữ liệu
- Tính toán tự động tổng kết
- Lưu trữ dữ liệu local (không cần internet)
- Xuất dữ liệu ra file Excel/CSV

### 🎯 Tính năng QC chuyên nghiệp
- Theo dõi số qui trình và tên hàng
- Ghi nhận trọng lượng OK/NG
- Phán định chất lượng (OK/NG)
- Ghi chú chi tiết về lỗi
- Theo dõi nhân viên QC

## Cách sử dụng

### 1. Khởi tạo
- Mở file `index.html` trên trình duyệt
- Nhập ngày QC và mã nhân viên
- Click "Thêm dòng mới" để bắt đầu nhập liệu

### 2. Nhập dữ liệu
- Điền thông tin vào các trường:
  - **Số qui trình**: Mã qui trình sản xuất
  - **Tên hàng**: Tên/mã sản phẩm
  - **Tổng số kg**: Trọng lượng tổng
  - **OK(kg)**: Trọng lượng sản phẩm đạt
  - **NG(kg)**: Trọng lượng sản phẩm không đạt
  - **Phán định**: Chọn OK hoặc NG
  - **Ghi chú**: Mô tả chi tiết lỗi (nếu có)

### 3. Quản lý dữ liệu
- **Chỉnh sửa**: Click nút ✏️ để mở form chỉnh sửa
- **Xóa**: Click nút 🗑️ để xóa dòng
- **Lưu**: Dữ liệu tự động lưu, hoặc click "Lưu dữ liệu"
- **Xuất Excel**: Click "Xuất Excel" để tải file CSV

### 4. Phím tắt
- `Ctrl + S`: Lưu dữ liệu
- `Ctrl + N`: Thêm dòng mới
- `Enter`: Chuyển sang ô tiếp theo
- `Escape`: Đóng modal

## Cấu trúc dữ liệu

Mỗi dòng dữ liệu bao gồm:
```json
{
  "stt": 1,
  "qcDate": "2024-01-15",
  "processNo": "244 2825",
  "itemName": "V77 B1 219 TA",
  "totalWeight": 4.56,
  "okWeight": 4.56,
  "ngWeight": 0,
  "judgment": "OK",
  "qcStaff": "14658",
  "notes": ""
}
```

## Tối ưu cho Tablet

### 🖱️ Touch-friendly
- Nút bấm lớn (tối thiểu 44px)
- Khoảng cách phù hợp giữa các element
- Scroll mượt mà trên bảng dữ liệu

### 📱 Responsive Design
- Tự động điều chỉnh theo kích thước màn hình
- Tối ưu cho cả tablet ngang và dọc
- Font size phù hợp cho đọc từ xa

### ⚡ Performance
- Tải nhanh, không cần server
- Lưu trữ local, hoạt động offline
- Auto-save để tránh mất dữ liệu

## Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Hỗ trợ HTML5 và CSS3
- JavaScript enabled
- Local Storage support

## Cài đặt

1. Tải toàn bộ thư mục `qc-form`
2. Mở file `index.html` trên trình duyệt
3. Không cần cài đặt thêm gì

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra JavaScript có được bật không
2. Xóa cache trình duyệt và thử lại
3. Đảm bảo Local Storage hoạt động bình thường

## Phiên bản

- **v1.0**: Phiên bản đầu tiên
  - Form nhập liệu cơ bản
  - Lưu trữ local
  - Xuất Excel/CSV
  - Responsive design cho tablet
