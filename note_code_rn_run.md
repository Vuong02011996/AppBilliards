1. Code async luôn bị trì hoãn và chạy sau khi render component.
   `getDataObject(KEY_TABLE_ITEM).then((infoTable)`

    - Bất đồng bộ viết sau luôn chạy sau bất đồng bộ viết trước dù bất đồng bộ viết sau nằm trong component con(trong menuItem).

    ```
         console.log('render lai sau khi xoa 2: idItem: tableId', idItem, tableId)
         getDataObject(KEY_TABLE_ITEM).then((infoTable)
    ```

    - Data (infoTable - 2 phần tử) khi gọi trong bất đồng bộ luôn là data tại thời điểm gọi nó, cho dù sau đó bất đồng bộ trong component cha đã chạy xong và lưu data mới (infoTable 3 phần tử sau khi thêm) thì bất đồng bộ trong component con khi chạy vẫn lấy data tại thời điểm gọi(infoTable - 2 phần tử).

    - Bất đồng bộ luôn chạy sau khi render hết component dù component render FlatList với component con bên trong , do đó
      nếu bên trong component con mong đợi một giá trị data mới từ bất đồng bộ bên ngoài để render sẽ không đúng.(tức render xong component con bên trong mới chạy bất đồng bộ bên ngoài)

2. FlatList render nhiều component bên trong(MenuItem) sẽ không chạy vào component mỗi khi renderItem mà đợi sau khi renderItem hết tất cả các phần tử trong mảng có FLatList sẽ vào component với Item cuối của FLatList ? Hoặc có một cơ chế chạy lại hoặc chỉ có component props thay đổi mới chạy vô ? ..

3. FlatList chỉ render lại component của Item cuối có thể là cơ chế để tăng perfomance., những component render rồi và không thay đổi props sẽ không render lại, ...
4. Chú ý: khi render lại component con xong(MenuItem) sẽ không chạy ngay vào bất đồng bộ mà chạy qua FlatList của TableItem rồi mới chạy lại bất đồng bộ component con để thực hiện.(FlatList render hai lần... ?)

# Chốt

-   FlatList chỉ trả về component thì chỉ render lại những component có props thay đổi , và trong những component này không có cơ chế (useEffect) để render lại chính nó thì chỉ chạy ngang qua như việc re-render lại component chớ không phải lần đầu tiên.
-   Important: Component render lại trong FlatList ở lần sau vẫn mang dữ liệu của chính nó ở lần đầu tiên (10, 13, 130 - component thứ 2 ở render khi thêm vào) do đó ta phải có cơ chế update lại dữ liệu của chính component đó khi(Xóa component thứ 2 thay thế vị trí đó bằng component thứ 3 thì phải render lại dữ liệu (inputData, price, quantity, ...) của component thứ 3)
