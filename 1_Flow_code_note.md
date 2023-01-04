# Flow chương trình chạy

    // Khi click vào một bàn từ trang chủ:

     * TH1: Chưa có table nào trong infoTable, chưa lưu vào Async Storage
     *      Tạo menuItem đầu tiên cho bàn và object infoTable đầu tiên lưu vào Async Storage
     * TH2: Đã có table trong infoTable trong Async Storage
     *  Tìm đúng idTable đã bấm.
     *  TH2.1: tableData === undefined bàn bấm vào chưa có data gì cả (lần đầu bấm vào)(data trong infoTable ở bàn khác)
     *          Tạo menuItem đầu tiên cho bàn và push object tableData vào infoTable
     *  TH2.2: có data trong object tableData
     *      TH2.2.1: nếu không có menu món, tạo món đầu tiên render
     *      TH2.2.2: nếu có menu món, tìm đúng idItem món và render

# Code note

```
array : infoTable = [tableData, tableData, ...] data lưu vào AsyncStorage
object : tableData = {
                        tableID: tableId,
                        gioVao: 'Chưa đặt',
                        gioNghi: 'Chưa bấm',
                        thoiGianChoi: 0,
                        tienGio: 0,
                        tienMenu: 0,
                        tongTien: 0,
                        infoMenu: [
                            {
                                idItem: idItemRandom,
                                Mon: '',
                                Gia: '',
                                SoLuong: '',
                                ThanhTien: 0,
                            },
                            ...
                        ],
                    }
```

# Code

-   Sử dụng `TouchableWithoutFeedback` bọc lại tableComponent để khi blur ra ngoài thì tự mất focus trong thẻ TextInput.
