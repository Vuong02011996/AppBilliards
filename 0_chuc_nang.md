# Chọn món

- Thêm button chọn món.
- Bấm vào button chọn món chuyển hướng đến một màn hình mới.
- Màn hình mới này load những món đã tạo và lưu trên firebase.
- Bấm + hoặc trừ để thêm món.
- Có thể sửa giá món ở đây và update lại firebase.
- Có thể lọc theo loại nước, món nhậu, bia , .. để tìm kiếm nhanh hơn.

# Màn hình chi tiết từng bàn

- Sau khi chọn món xong sẽ tự động load những món đã chọn dùng real time database.
- Có thể tăng giảm số lượng , xóa hoặc đổi giá món ở đây.
- Thêm giảm giá tiền giờ bao nhiêu %.

# Màn hình chính

- Thêm Button Tạo món, Báo cáo.

## Màn hình tạo món

    + Hiển thị list danh sách món đã tạo trên firebase.
    + Thêm món.
    + Xóa.
    + Sửa.

## Báo cáo

    + Hôm nay(hoặc chọn ngày trên lịch 1 tháng), tháng này, tháng trước.
    + Kho hàng: sản phẩm số lượng còn, lọc sản phẩm hết hàng, sản phẩm còn mỗi loại bao nhiều .
    + Phân tích: nhập kho xuất kho
    + Thu chi: Tổng thu, tổng chi , tổng thu theo tháng, theo ngày.
    ...

# Các bảng trên firebase

- Danh sách bàn : document = số lượng bàn , tên bàn, trạng thái, tên món, tiền giờ, ....
- Danh sách món: tên món, giá, loại món, ký hiệu (để tìm nhanh),

# Deploy vs firebase có lỗi chi không?

# Test hoạt động có lỗi ...

# Chi tiết

- Component
  - Render Mon:
    - Load danh sách món của bàn trên firebase(realtime)
    - Tính luôn tổng tiền món.
  - Chọn Món:
    - Load danh sách món đã tạo
    - CHo thêm ảnh mỗi món.

# In

- Tạo hóa đơn để in
- In để cắt đầy đủ thông tin hóa đơn.

# Fix bug hoàn thiện :

- Cho thay đổi giá , số lượng tạm thời ở mỗi bàn (chỉ không update lại giá trên DB món) vẫn lưu để báo cáo.
- Thêm button xóa món, Căn chỉnh hóa đơn.

- Tạo hóa đơn in bài bản

- Sửa màn hình tạo món.
- Sửa màn hình chính.
- Làm sơ màn hình báo cáo.

- Chức năng lọc ở màn hình chọn món.

- Tạo file apk.
