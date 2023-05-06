# Chọn món

-   Thêm button chọn món.
-   Bấm vào button chọn món chuyển hướng đến một màn hình mới.
-   Màn hình mới này load những món đã tạo và lưu trên firebase.
-   Bấm + hoặc trừ để thêm món.
-   Có thể sửa giá món ở đây và update lại firebase.
-   Có thể lọc theo loại nước, món nhậu, bia , .. để tìm kiếm nhanh hơn.

# Màn hình chi tiết từng bàn

-   Sau khi chọn món xong sẽ tự động load những món đã chọn dùng real time database.
-   Có thể tăng giảm số lượng , xóa hoặc đổi giá món ở đây.
-   Thêm giảm giá tiền giờ bao nhiêu %.

# Màn hình chính

-   Thêm Button Tạo món, Báo cáo.

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

-   Danh sách bàn : document = số lượng bàn , tên bàn, trạng thái, tên món, tiền giờ, ....
-   Danh sách món: tên món, giá, loại món, ký hiệu (để tìm nhanh),

# Deploy vs firebase có lỗi chi không?

# Test hoạt động có lỗi ...

# Chi tiết

-   Khi bấm vô từng bàn sẽ load dữ liệu danh sách bàn trên firebase , kiểm tra có bàn với tableId chưa

    -   Nếu chưa có thì add document với dữ liệu rỗng và trạng thái chưa hoạt động.
    -   Nếu có rồi
        -   Nếu trang thái đang chơi thì load dữ liệu đang hoạt động ra.(gồm món ăn tiền giờ, ...)
        -   Nếu trạng thái chưa chơi thì...

-   Component
    -   Render Mon:
        -   Load danh sách món của bàn trên firebase(realtime)
        -   Tính luôn tổng tiền món.
    -   Chọn Món:
        -   Load danh sách món đã tạo
        -   CHo thêm ảnh mỗi món.

# In

-   Tạo hóa đơn để in
-   In để cắt đầy đủ thông tin hóa đơn.
