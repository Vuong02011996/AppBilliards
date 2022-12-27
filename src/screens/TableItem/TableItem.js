import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, Pressable } from 'react-native';
import * as React from 'react';
import uuid from 'react-native-uuid';
import MenuItem from '../../components/MenuItem.js';
import { KEY_TABLE_ITEM } from '../../utils/KeyStorage.js';
import { getDataObject, storeObjectValue, removeValueOfKey } from '../../utils/storage';

function TableItem({ route, navigation }) {
    const { tableId, title } = route.params;

    // Danh sách chứa các Món(component MenuItem) để render
    const [menuItemList, setMenuItemList] = React.useState([]);
    const [tongtien, setTongTien] = React.useState(0);
    const [gioVao, setGioVao] = React.useState('Chưa đặt');
    const [gioNghi, setGioNghi] = React.useState('Chưa đặt');
    const [thoiGianChoi, setThoiGianChoi] = React.useState(0);
    const [tienGio, setTienGio] = React.useState(0);

    const handleDeleteMon = (tableId, idItem) => {
        // Xem index xoá là item nào trong menuItemList rồi xóa bằng splice(index, 1)

        // Cập nhật lại số lượng Món trong bàn
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
            console.log('infoTable trước khi xóa món: ', infoTable);
            for (var i = 0; i < infoTable.length; i++) {
                // Tìm đúng bàn
                if (infoTable[i].tableID == tableId) {
                    for (var j = 0; j < infoTable[i].infoMenu.length; j++) {
                        if (infoTable[i].infoMenu[j].idItem === idItem) {
                            infoTable[i].infoMenu.splice(j, 1);
                            break;
                        }
                    }
                    var sumMoney = infoTable[i].infoMenu.reduce(function (total, infoMenuItem) {
                        return total + infoMenuItem.ThanhTien;
                    }, 0);
                    if (infoTable[i].infoMenu.length === 0) {
                        infoTable.splice(i, 1);
                    }

                    // update lại infoTable, menuItemList
                    console.log('infoTable sau khi xóa món: ', infoTable);
                    storeObjectValue(KEY_TABLE_ITEM, infoTable);
                    setMenuItemList((menuItemList) => {
                        console.log('index Xoa trong ham', idItem);
                        const newMenuItemList = [...menuItemList];
                        const newMenuItemList1 = [...newMenuItemList];
                        console.log('newMenuItemList truoc khi xoa', newMenuItemList1);
                        for (var i = 0; i < menuItemList.length; i++) {
                            if (menuItemList[i].props.props.idItem === idItem) {
                                console.log(
                                    'menuItemList[i].props.props.idItem Xoa trong ham',
                                    menuItemList[i].props.props.idItem,
                                );
                                console.log('index xoa: ', i);
                                newMenuItemList.splice(i, 1);
                                break;
                            }
                        }
                        console.log('newMenuItemList sau khi xoa', newMenuItemList);
                        return newMenuItemList;
                    });
                    setTongTien(sumMoney);
                    break;
                }
            }
        });
    };

    const handleAddMon = () => {
        // Cập nhật lại số lượng Món trong bàn
        // setMenuItemList phải nằm trong bất đồng bộ để chạy sau
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
            console.log('infoTable trước khi thêm món: ', infoTable);
            let idItemRandom = uuid.v4();
            for (var i = 0; i < infoTable.length; i++) {
                // Tìm đúng bàn
                if (infoTable[i].tableID == tableId) {
                    infoTable[i].infoMenu.push({
                        idItem: idItemRandom,
                        Mon: '',
                        Gia: '',
                        SoLuong: '',
                        ThanhTien: 0,
                    });
                }
            }
            console.log('infoTable sau khi thêm món: ', infoTable);
            storeObjectValue(KEY_TABLE_ITEM, infoTable);

            // Thêm món vào menuItemList và render lại
            setMenuItemList((menuItemList) => {
                const newMenuItemList = [...menuItemList];

                newMenuItemList.push(
                    <MenuItem
                        props={{
                            showText: 'none',
                            idItem: idItemRandom,
                            tableId: tableId,
                            handleDeleteMon: handleDeleteMon,
                            setTongTien: setTongTien,
                        }}
                    />,
                );
                return newMenuItemList;
            });
        });
    };

    const handelDatGioVao = () => {
        function handleThayDoiGio() {
            const currTime = new Date().toLocaleString();

            getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
                for (var i = 0; i < infoTable.length; i++) {
                    // Tìm đúng bàn
                    if (infoTable[i].tableID == tableId) {
                        infoTable[i].gioVao = currTime;
                        infoTable[i].thoiGianChoi = 0;
                        break;
                    }
                }
                storeObjectValue(KEY_TABLE_ITEM, infoTable);
                setGioVao(currTime);
            });
        }
        if (gioVao != 'Chưa đặt') {
            Alert.alert('Thay đổi giờ vào sẽ thay đổi hóa đơn', 'Bạn có chắc chắn muốn thay đổi?', [
                {
                    text: 'Có',
                    onPress: handleThayDoiGio,
                },
                {
                    text: 'Không',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ]);
        } else {
            handleThayDoiGio();
        }
    };
    const handelDatGioNghi = () => {
        function handleThayDoiGio() {
            const currTime = new Date().toLocaleString();

            getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
                for (var i = 0; i < infoTable.length; i++) {
                    // Tìm đúng bàn
                    if (infoTable[i].tableID == tableId) {
                        infoTable[i].gioNghi = currTime;
                        infoTable[i].thoiGianChoi = 0;

                        var a = new Date().getTime();
                        console.log(' Number(new Date(string))', Number(new Date(Number(currTime))));
                        console.log('Math.floor(new Date(time) / 1000)', Math.floor(Number(new Date(currTime)) / 1000));
                        console.log('a: ', a);
                        console.log('typeof a: ', typeof a);
                        console.log('currTime: ', currTime);
                        console.log('currTime: ', typeof currTime);
                        console.log('Date.parse: ', Date.parse(currTime));
                        console.log(' new Date: ', new Date(currTime));
                        break;
                    }
                }
                storeObjectValue(KEY_TABLE_ITEM, infoTable);
                setGioNghi(currTime);
            });
        }
        if (gioNghi != 'Chưa đặt') {
            Alert.alert('Thay đổi giờ vào sẽ thay đổi hóa đơn', 'Bạn có chắc chắn muốn thay đổi?', [
                {
                    text: 'Có',
                    onPress: handleThayDoiGio,
                },
                {
                    text: 'Không',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ]);
        } else {
            handleThayDoiGio();
        }
    };

    React.useEffect(() => {
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
            console.log('infoTable: ', typeof infoTable, infoTable);
            let menuItemListData;
            // Chưa có table nào trong infoTable, chưa lưu vào Async Storage
            // infoTable.length === 0 TH xóa hết infoMenu
            if (infoTable === null || infoTable.length === 0) {
                console.log('tableID null: ', tableId);
                // IdItem 0
                let idItemRandom = uuid.v4();
                const data = [
                    {
                        tableID: tableId,
                        menuItemList: [
                            <MenuItem
                                props={{
                                    showText: 'flex',
                                    idItem: idItemRandom,
                                    tableId: tableId,
                                    handleDeleteMon: handleDeleteMon,
                                    setTongTien: setTongTien,
                                }}
                            />,
                        ],
                    },
                ];
                menuItemListData = data[0].menuItemList;
                console.log('infoTable TH1 infoTable = null: ', infoTable);

                // lưu infoMenu đầu tiên trong bàn
                storeObjectValue(KEY_TABLE_ITEM, [
                    {
                        tableID: tableId,
                        gioVao: 'Chưa đặt',
                        gioNghi: 'Chưa đặt',
                        thoiGianChoi: 0,
                        tienGio: 0,
                        tongTien: 0,
                        infoMenu: [
                            {
                                idItem: idItemRandom,
                                Mon: '',
                                Gia: '',
                                SoLuong: '',
                                ThanhTien: 0,
                            },
                        ],
                    },
                ]);
            } else {
                // Đã có số MenuItem trong table ,
                // Load lại số lượng menuItem từ AsyncStorage và add vào menuItemListData để render lại
                // Lấy đúng table ID
                var tableData = infoTable.find(function (table, index) {
                    return table.tableID === tableId;
                });
                // Món đầu tiên cho bàn chưa có trong infoTable
                if (tableData === undefined) {
                    // IdItem 0
                    let idItemRandom = uuid.v4();
                    menuItemListData = [
                        <MenuItem
                            props={{
                                showText: 'flex',
                                idItem: idItemRandom,
                                tableId: tableId,
                                handleDeleteMon: handleDeleteMon,
                                setTongTien: setTongTien,
                            }}
                        />,
                    ];
                    infoTable.push({
                        tableID: tableId,
                        gioVao: 'Chưa đặt',
                        gioNghi: 'Chưa đặt',
                        thoiGianChoi: 0,
                        tienGio: 0,
                        tongTien: 0,
                        infoMenu: [
                            {
                                idItem: idItemRandom,
                                Mon: '',
                                Gia: '',
                                SoLuong: '',
                                ThanhTien: 0,
                            },
                        ],
                    });
                    storeObjectValue(KEY_TABLE_ITEM, infoTable);
                    console.log('infoTable TH2 infoTable != null, tableData = undefined, infoTable:', infoTable);
                }
                // Nếu có rồi thì lấy số lượng Món và render
                else {
                    // IdItem 0
                    menuItemListData = [
                        <MenuItem
                            props={{
                                showText: 'flex',
                                idItem: tableData.infoMenu[0].idItem,
                                tableId: tableId,
                                handleDeleteMon: handleDeleteMon,
                                setTongTien: setTongTien,
                            }}
                        />,
                    ];
                    let sumMoney = tableData.infoMenu[0].ThanhTien;
                    for (var i = 1; i < tableData.infoMenu.length; i++) {
                        menuItemListData.push(
                            <MenuItem
                                props={{
                                    showText: 'none',
                                    idItem: tableData.infoMenu[i].idItem,
                                    tableId: tableId,
                                    handleDeleteMon: handleDeleteMon,
                                    setTongTien: setTongTien,
                                }}
                            />,
                        );
                        sumMoney += tableData.infoMenu[i].ThanhTien;
                    }
                    console.log('infoTable TH3 infoTable != null, tableData != undefined, infoTable: ', infoTable);
                    setGioVao(tableData.gioVao);
                    setGioNghi(tableData.gioNghi);
                    setThoiGianChoi(tableData.thoiGianChoi);
                    setTienGio(tableData.tienGio);
                    setTongTien(sumMoney);
                }
            }
            setMenuItemList(menuItemListData);
        });
    }, []);

    // Update lại tên title khi click vào từng bàn
    React.useEffect(() => {
        if (route.params?.title) {
            navigation.setOptions({ title: title });
        }
    }, [route.params?.title]);

    //Thêm món
    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={handleAddMon}
                    style={{
                        backgroundColor: 'blue',
                        padding: 8,
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: 'white',
                        }}
                    >
                        Thêm
                    </Text>
                </Pressable>
            ),
        });
    }, [navigation]);

    // Tính tiền giờ bàn và tổng tiền trong menu
    // Cứ mỗi phút sẽ lấy thời gian hiện tại trừ cho thời gian start * tiền mỗi phút
    // Tổng tiền menu sẽ lấy từ AsyncStorage
    return (
        <View>
            <FlatList
                data={menuItemList}
                keyExtractor={(item, index) => {
                    console.log('item.props.props.idItem: ', item.props.props.idItem);
                    return `${index}`;
                }}
                renderItem={({ item }) => {
                    console.log('len menuItemList', menuItemList.length);
                    console.log('render item', item.props.props.idItem);
                    return item;
                }}
            />
            {/* <RenderMon props={{ showText: 'flex', id: 0 }} /> */}
            <Text>Tổng tiền thực đơn: {tongtien}K</Text>
            {/* Giờ vào */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={styles.textGio}>Giờ vào: </Text>
                <Text style={styles.textGio}>{gioVao} </Text>
                <Pressable onPress={handelDatGioVao} style={styles.buttonDatGio}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: 'white',
                        }}
                    >
                        Đặt giờ vào
                    </Text>
                </Pressable>
            </View>

            {/* Giờ nghỉ */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.textGio}>Giờ nghỉ: </Text>
                <Text style={styles.textGio}>{gioNghi} </Text>
                <Pressable onPress={handelDatGioNghi} style={styles.buttonDatGio}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: 'white',
                        }}
                    >
                        Đặt giờ nghỉ
                    </Text>
                </Pressable>
            </View>
            <Text>Thời gian chơi: {thoiGianChoi}</Text>

            {/* <Text>Giờ ra: {curentTime}</Text> */}
            <Text>Tổng tiền: {tongtien}K</Text>
        </View>
    );
}

export default TableItem;
const styles = StyleSheet.create({
    textGio: {
        fontSize: 18,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    buttonDatGio: {
        backgroundColor: 'blue',
        padding: 8,
        width: 120,
    },
});

/**
 * Tính tổng - ok
 * Hiển thị giờ start, và tổng tiền bên ngoài, trang trí thêm bàn bên ngoài
 * Thêm nút Đặt lại : start lại giờ bắt đầu, xóa hết món trong table.
 * Gợi ý tên món bấm nhanh
 * Đặt focus vô tên món trước
 * Kết nối máy in bằng wifi blutooth
 * Bug
 * Bấm xóa tên món biến mất - ok
 */
