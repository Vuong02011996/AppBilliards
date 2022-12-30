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
    const [tongTien, setTongTien] = React.useState(0);
    const [tienKhachDua, setTienKhachDua] = React.useState(0);
    const [tienThoiLai, setTienThoiLai] = React.useState(0);

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
                    // if (infoTable[i].infoMenu.length === 0) {
                    //     infoTable.splice(i, 1);
                    // }

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
                                const moneyTime = Math.ceil((intervalTimeCost * tienGioMoiPhut) / 1000);
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
        const handleDatLaiHoaDon = () => {
            getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
                for (var i = 0; i < infoTable.length; i++) {
                    if (infoTable[i].tableID == tableId) {
                        let idItemRandom = uuid.v4();
                        const menuItemListData = [
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
                        infoTable[i] = {
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
                        };
                        storeObjectValue(KEY_TABLE_ITEM, infoTable);
                        setMenuItemList(menuItemListData);
                        setTienMenu(0);
                        setGioVao('Chưa đặt');
                        setGioNghi('Chưa bấm');
                        setThoiGianChoi(0);
                        setTienGio(0);
                        setTongTien(0);
                        setTienKhachDua(0);
                        setTienThoiLai(0);
                        break;
                    }
                }
            });
        };
        if (gioVao != 'Chưa đặt') {
            Alert.alert('Đặt lại sẽ xóa hóa đơn hiện tại', 'Bạn có chắc chắn muốn xóa không?', [
                {
                    text: 'Có',
                    onPress: handleDatLaiHoaDon,
                },
                {
                    text: 'Không',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ]);
        } else {
            handleDatLaiHoaDon();
        }
    };

    // handle thối lại tiên
    const handelThoiTien = (newTienKhachDua) => {
        if (newTienKhachDua > 0) {
            setTienKhachDua(newTienKhachDua);
            setTienThoiLai(newTienKhachDua - tongTien);
        } else {
            setTienKhachDua(0);
            setTienThoiLai(0);
        }
    };
    // Handle In hóa đơn
    const handelInHoaDon = () => {};

    // Khi click vào một  bàn từ trang chủ sẽ load thông tin bàn đó 1 trong 3 trường hợp sau
    /**
     * TH1: Chưa có table nào trong infoTable, chưa lưu vào Async Storage
     *      Tạo menuItem đầu tiên cho bàn và object infoTable đầu tiên lưu vào Async Storage
     * TH2: Đã có table trong infoTable trong Async Storage
     *  Tìm đúng idTable đã bấm.
     *  TH2.1: tableData === undefined bàn bấm vào chưa có data gì cả (lần đầu bấm vào)(data trong infoTable ở bàn khác)
     *          Tạo menuItem đầu tiên cho bàn và push object tableData vào infoTable
     *  TH2.2: có data trong object tableData, render cái data về thời gian của table Data.
     *      TH2.2.1: nếu không có menu món, tạo món đầu tiên render
     *      TH2.2.2: nếu có menu món, tìm đúng idItem món và render
     */
    React.useEffect(() => {
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
            console.log('infoTable: ', typeof infoTable, infoTable);
            let menuItemListData;
            // Chưa có table nào trong infoTable, chưa lưu vào Async Storage
            if (infoTable === null) {
                console.log('tableID null: ', tableId);
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
                // menuItemListData = data[0].menuItemList;
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
                //  infoTable có data nhưng bàn bấm vào chưa có data
                if (tableData === undefined) {
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
                    console.log('infoTable TH2.1 infoTable != null, tableData = undefined, infoTable:', infoTable);
                } else {
                    let menuMoney = 0;
                    // Nếu chưa có món thì tạo món đầu tiên render(do bị xóa hoặc bàn không chọn món)
                    if (tableData.infoMenu.length == 0) {
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
                    }
                    // Nếu có món thì lấy số lượng Món và render
                    else {
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
                        menuMoney += tableData.infoMenu[0].ThanhTien;
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
                    }
                    // render cái data về thời gian của table Data
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

    // Tính lại tiền thừa khi có tiền khách đưa mỗi khi tổng tiền thay đổi
    React.useEffect(() => {
        if (tienKhachDua > 0) {
            setTienThoiLai(tienKhachDua - tongTien);
        }
    }, [tongTien]);

    return (
        <TouchableWithoutFeedback>
            {/* FlatList in ScrollView
            https://stackoverflow.com/questions/67623952/error-virtualizedlists-should-never-be-nested-inside-plain-scrollviews-with-th */}
            <ScrollView nestedScrollEnabled={true} style={{ marginHorizontal: 8 }}>
                <View>
                    <ScrollView horizontal={true} style={{ width: '100%' }}>
                        <FlatList
                            data={menuItemList}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({ item }) => {
                                console.log('len menuItemList', menuItemList.length);
                                console.log('render item', item.props.props.idItem);
                                return item;
                            }}
                        />
                    </ScrollView>
                </View>

                {/* Thông tin hóa đơn */}
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textTongTienThucDon, { minWidth: 246 }]}>Tổng tiền thực đơn:</Text>
                        <Text style={styles.textTongTienThucDon}>{tienMenu}K</Text>
                    </View>
                    {/* Giờ vào */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={styles.textGio}>Giờ vào: </Text>
                        <Text style={styles.textGio}>{gioVao} </Text>
                        <Pressable
                            onPress={handelDatGioVao}
                            style={({ pressed }) => [
                                styles.buttonDatGio,
                                {
                                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                                },
                            ]}
                        >
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
                        <Pressable
                            onPress={handelDatGioNghi}
                            style={({ pressed }) => [
                                styles.buttonDatGio,
                                {
                                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                                },
                            ]}
                        >
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
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textThoiGianChoi, { minWidth: 246 }]}>Thời gian chơi: </Text>
                        <Text style={styles.textThoiGianChoi}>{thoiGianChoi} phút</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textTongTien, { minWidth: 246 }]}>Tiền Giờ:</Text>
                        <Text style={styles.textTongTien}>{tienGio}K</Text>
                    </View>
                    <Text style={[styles.textTongTien, { color: '#000', marginVertical: 4, fontSize: 20 }]}>
                        Tổng tiền thanh toán: {tongTien}K
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textThoiGianChoi, { minWidth: 246, color: '#5f5151', fontWeight: '500' }]}>
                            Tiền khách đưa:
                        </Text>
                        <TextInput
                            style={styles.textInputTienKhachDua}
                            keyboardType="numeric"
                            onChangeText={handelThoiTien}
                        >
                            {tienKhachDua}
                        </TextInput>
                        <Text style={[styles.textThoiGianChoi, { minWidth: 246, color: '#000', fontWeight: '500' }]}>
                            K
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textThoiGianChoi, { minWidth: 246, color: '#5f5151', fontWeight: '500' }]}>
                            Tiền thừa:
                        </Text>
                        <Text style={[styles.textThoiGianChoi, { minWidth: 246, color: '#000', fontWeight: '500' }]}>
                            {tienThoiLai}K
                        </Text>
                    </View>

                    {/* Tiền giờ mỗi phút */}
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Text style={styles.textTienGioMoiPhut}>Đơn giá mỗi phút:</Text>

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
                    {/*  Button đặt lại và in hóa đơn */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* In hóa đơn */}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8 }}>
                            <Pressable
                                onPress={handelInHoaDon}
                                style={({ pressed }) => [
                                    styles.buttonDatGio,
                                    {
                                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: 'white',
                                    }}
                                >
                                    In hóa đơn
                                </Text>
                            </Pressable>
                        </View>
                        {/* Đặt lại */}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                            <Pressable
                                onPress={handelReset}
                                style={({ pressed }) => [
                                    styles.buttonDatGio,
                                    {
                                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                                    },
                                ]}
                            >
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
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
export default TableItem;
const styles = StyleSheet.create({
    textGio: {
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
    },
    buttonDatGio: {
        backgroundColor: 'blue',
        padding: 8,
        width: 120,
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
        // padding: 0,
        paddingHorizontal: 20,
        paddingVertical: 4,
        marginHorizontal: 10,
    },
    textInputTienKhachDua: {
        borderWidth: 1,
        fontSize: 18,
        height: 30,
        backgroundColor: 'yellow',
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        // padding: 0,
        paddingHorizontal: 30,
        paddingVertical: 4,
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
 * Bug Thêm nút Đặt lại : start lại giờ bắt đầu, xóa hết món trong table.
 * Gợi ý tên món bấm nhanh- không được khó - z index of thẻ text input Flatlist.
 * Kết nối máy in bằng wifi blutooth
 * Thêm máy tính nếu chơi rồi chơi tiếp(chưa cần)
 * Handle useEffect khi tien thanh toan thay doi ma tien khach dua > 0 thi cap nhat lai tien thua
 * Bug
 */
