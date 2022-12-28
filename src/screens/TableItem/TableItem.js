import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Keyboard,
    FlatList,
    Alert,
    Pressable,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import * as React from 'react';
import moment from 'moment';
import uuid from 'react-native-uuid';
import MenuItem from '../../components/MenuItem.js';
import { KEY_TABLE_ITEM } from '../../utils/KeyStorage.js';
import { getDataObject, storeObjectValue, removeValueOfKey } from '../../utils/storage';

function TableItem({ route, navigation }) {
    const { tableId, title } = route.params;

    // Danh sách chứa các Món(component MenuItem) để render
    const [menuItemList, setMenuItemList] = React.useState([]);
    const [tienMenu, setTienMenu] = React.useState(0);
    const [gioVao, setGioVao] = React.useState('Chưa đặt');
    const [gioNghi, setGioNghi] = React.useState('Chưa bấm');
    const [thoiGianChoi, setThoiGianChoi] = React.useState(0);
    const [tienGioMoiPhut, setTienGioMoiPhut] = React.useState(420);
    const [tienGio, setTienGio] = React.useState(0);
    const [tongtien, setTongTien] = React.useState(0);

    const handleDeleteMon = (tableId, idItem) => {
        // Xem index xoá là item nào trong menuItemList rồi xóa bằng splice(index, 1)

        // Cập nhật lại số lượng Món trong bàn
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
            for (var i = 0; i < infoTable.length; i++) {
                // Tìm đúng bàn
                if (infoTable[i].tableID == tableId) {
                    for (var j = 0; j < infoTable[i].infoMenu.length; j++) {
                        if (infoTable[i].infoMenu[j].idItem === idItem) {
                            infoTable[i].infoMenu.splice(j, 1);
                            break;
                        }
                    }
                    var menuMoney = infoTable[i].infoMenu.reduce(function (total, infoMenuItem) {
                        return total + infoMenuItem.ThanhTien;
                    }, 0);
                    if (infoTable[i].infoMenu.length === 0) {
                        infoTable.splice(i, 1);
                    }

                    // update lại infoTable, menuItemList
                    storeObjectValue(KEY_TABLE_ITEM, infoTable);
                    setMenuItemList((menuItemList) => {
                        const newMenuItemList = [...menuItemList];
                        const newMenuItemList1 = [...newMenuItemList];
                        for (var i = 0; i < menuItemList.length; i++) {
                            if (menuItemList[i].props.props.idItem === idItem) {
                                newMenuItemList.splice(i, 1);
                                break;
                            }
                        }
                        return newMenuItemList;
                    });
                    setTienMenu(menuMoney);
                    setTongTien(menuMoney + infoTable[i].tienGio);
                    break;
                }
            }
        });
    };

    const handleAddMon = () => {
        // Cập nhật lại số lượng Món trong bàn
        // setMenuItemList phải nằm trong bất đồng bộ để chạy sau
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
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
                            setTienMenu: setTienMenu,
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
                        infoTable[i].gioNghi = 'Chưa bấm';
                        break;
                    }
                }
                storeObjectValue(KEY_TABLE_ITEM, infoTable);
                setGioVao(currTime);
                setGioNghi('Chưa bấm');
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
                        // Nếu đã có giờ vào thì tính thời gian chơi (intervalTimeCost)
                        // Tính tiền giờ
                        // Tính tổng tiền (tiền giờ + tiền menu)
                        // SetState lại: setGioNghi, setThoiGianChoi,setTienGio, setTongTien,
                        if (infoTable[i].gioVao != 'Chưa đặt') {
                            const timeClose = moment(currTime, 'HH:mm:ss, DD/MM/YYYY').valueOf();
                            const timeStart = moment(infoTable[i].gioVao, 'HH:mm:ss, DD/MM/YYYY').valueOf();
                            let intervalTimeCost = timeClose - timeStart;
                            if (intervalTimeCost > 0) {
                                intervalTimeCost = Math.round(intervalTimeCost / 1000 / 60);
                                const moneyTime = (intervalTimeCost * tienGioMoiPhut) / 1000;
                                const totalMoney = moneyTime + tienMenu;

                                infoTable[i].gioNghi = currTime;
                                infoTable[i].thoiGianChoi = intervalTimeCost;
                                infoTable[i].tienGio = moneyTime;
                                infoTable[i].tongTien = totalMoney;

                                storeObjectValue(KEY_TABLE_ITEM, infoTable);

                                setThoiGianChoi(intervalTimeCost);
                                setTienGio(moneyTime);
                                setTongTien(totalMoney);
                                setGioNghi(currTime);
                            } else {
                                Alert.alert(
                                    'Giờ vào đặt sau giờ nghỉ!, Vui lòng đặt giờ vào trước rồi mới bấm giờ nghỉ!',
                                );
                            }
                        } else {
                            Alert.alert('Giờ vào chưa đặt!, Vui lòng đặt giờ vào rồi mới bấm giờ nghỉ!');
                        }
                        break;
                    }
                }
            });
        }
        if (gioNghi != 'Chưa bấm') {
            Alert.alert('Thay đổi giờ nghỉ sẽ thay đổi hóa đơn', 'Bạn có chắc chắn muốn thay đổi?', [
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

    const handelChangeTienMoiPhut = (newTienGioMoiPhut) => {
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
            for (var i = 0; i < infoTable.length; i++) {
                // Tìm đúng bàn
                // Thay đổi lại tiền giờ và tổng tiền khi tiền giờ mỗi phút thay đổi
                if (infoTable[i].tableID == tableId) {
                    if (infoTable[i].gioVao != 'Chưa đặt' && infoTable[i].gioNghi != 'Chưa đặt') {
                        const moneyTime = (infoTable[i].thoiGianChoi * newTienGioMoiPhut) / 1000;
                        const totalMoney = moneyTime + tienMenu;
                        setTienGio(moneyTime);
                        setTongTien(totalMoney);
                    }
                    break;
                }
            }
            setTienGioMoiPhut(newTienGioMoiPhut);
        });
    };

    // Handle đặt lại
    const handelReset = () => {
        console.log('Dat lai');
        // getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
        //     for (var i = 0; i < infoTable.length; i++) {
        //         // Tìm đúng bàn
        //         if (infoTable[i].tableID == tableId) {
        //             storeObjectValue(KEY_TABLE_ITEM, [
        //                 {
        //                     tableID: tableId,
        //                     gioVao: 'Chưa đặt',
        //                     gioNghi: 'Chưa bấm',
        //                     thoiGianChoi: 0,
        //                     tienGio: 0,
        //                     tienMenu: 0,
        //                     tongTien: 0,
        //                     infoMenu: [
        //                         {
        //                             idItem: idItemRandom,
        //                             Mon: '',
        //                             Gia: '',
        //                             SoLuong: '',
        //                             ThanhTien: 0,
        //                         },
        //                     ],
        //                 },
        //             ]);
        //         }
        //     }
        // });
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
                                    setTienMenu: setTienMenu,
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
                        ],
                    },
                ]);
            } else {
                // Đã có một số MenuItem trong table ,
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
                                setTienMenu: setTienMenu,
                                setTongTien: setTongTien,
                            }}
                        />,
                    ];
                    infoTable.push({
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
                                setTienMenu: setTienMenu,
                                setTongTien: setTongTien,
                            }}
                        />,
                    ];
                    let menuMoney = tableData.infoMenu[0].ThanhTien;
                    for (var i = 1; i < tableData.infoMenu.length; i++) {
                        menuItemListData.push(
                            <MenuItem
                                props={{
                                    showText: 'none',
                                    idItem: tableData.infoMenu[i].idItem,
                                    tableId: tableId,
                                    handleDeleteMon: handleDeleteMon,
                                    setTienMenu: setTienMenu,
                                    setTongTien: setTongTien,
                                }}
                            />,
                        );
                        menuMoney += tableData.infoMenu[i].ThanhTien;
                    }
                    setGioVao(tableData.gioVao);
                    setGioNghi(tableData.gioNghi);
                    setThoiGianChoi(tableData.thoiGianChoi);
                    setTienGio(tableData.tienGio);
                    setTienMenu(menuMoney);
                    setTongTien(tableData.tongTien);
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
                    menuMoney
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
        <TouchableWithoutFeedback>
            {/* FlatList in ScrollView
            https://stackoverflow.com/questions/67623952/error-virtualizedlists-should-never-be-nested-inside-plain-scrollviews-with-th */}
            <ScrollView nestedScrollEnabled={true} style={{ marginHorizontal: 8 }}>
                <View>
                    <ScrollView horizontal={true} style={{ width: '100%' }}>
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
                    </ScrollView>
                </View>

                {/* Thông tin hóa đơn */}
                <Text style={styles.textTongTienThucDon}>Tổng tiền thực đơn: {tienMenu}K</Text>
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
                            Bấm giờ nghỉ
                        </Text>
                    </Pressable>
                </View>
                <Text style={styles.textThoiGianChoi}>Thời gian chơi: {thoiGianChoi} phút</Text>
                <Text style={styles.textTongTien}>Tiền Giờ: {tienGio}K</Text>
                <Text style={[styles.textTongTien, { color: 'blue' }]}>Tổng tiền: {tongtien}K</Text>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text style={styles.textTienGioMoiPhut}>Tiền giờ mỗi phút:</Text>

                    <TextInput
                        style={styles.textInputChangeTienMoiPhut}
                        keyboardType="numeric"
                        onChangeText={handelChangeTienMoiPhut}
                    >
                        {tienGioMoiPhut}
                    </TextInput>

                    <Text style={styles.textTienGioMoiPhut}>đồng</Text>
                    <Text style={styles.textTienGioMoiPhut}>({(tienGioMoiPhut * 60) / 1000}K/giờ)</Text>
                </View>
                <View>
                    <Pressable onPress={handelReset} style={styles.buttonDatGio}>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 16,
                                color: 'white',
                            }}
                        >
                            Đặt lại
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
export default TableItem;
const styles = StyleSheet.create({
    textGio: {
        fontSize: 18,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
    },
    buttonDatGio: {
        backgroundColor: 'blue',
        padding: 8,
        width: 110,
    },
    textTienGioMoiPhut: {
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        textTransform: 'uppercase',
        color: '#c8361b',
    },
    textInputChangeTienMoiPhut: {
        borderWidth: 1,
        fontSize: 18,
        height: 30,
        backgroundColor: 'yellow',
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 0,
        paddingHorizontal: 8,
        marginHorizontal: 10,
    },
    textTongTienThucDon: {
        fontWeight: '600',
        fontSize: 18,
        color: '#c8361b',
        textTransform: 'uppercase',
    },
    textThoiGianChoi: {
        fontWeight: '600',
        fontSize: 18,
        color: '#c8361b',
    },
    textTongTien: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#c8361b',
        textTransform: 'uppercase',
    },
});

/**
 * Thêm nút Đặt lại : start lại giờ bắt đầu, xóa hết món trong table.
 * Gợi ý tên món bấm nhanh
 * Đặt focus vô tên món trước
 * Kết nối máy in bằng wifi blutooth
 * Thêm textInput nếu chơi rồi chơi tiếp
 *
 * Bug
 */
