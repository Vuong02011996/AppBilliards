import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import React from 'react';
import TextInputCustom from './TextInputCustom';
import { getDataString, storeDataString, storeObjectValue, getDataObject, removeValueOfKey } from '../utils';
import { KEY_MON, KEY_GIA, KEY_SO_LUONG, KEY_THANH_TIEN, KEY_MENU_ITEM, KEY_TABLE_ITEM } from '../utils';

const MenuItem = ({ props }) => {
    const { idItem, showText, tableId, handleDeleteMon, setTienMenu, setTongTien } = props;

    const [inputData, setInputData] = React.useState('');
    const [inputPrice, setInputPrice] = React.useState('');
    const [inputQuantity, setInputQuantity] = React.useState('');
    const [inputMoney, setInputMoney] = React.useState(0);
    // Chạy một lần khi render tới MenuItem nào trong menuItemList thì lấy giá trị từ storage hiển thị lên
    React.useEffect(() => {
        getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
            // Tim dung ban
            var tableData = infoTable.find(function (table, index) {
                return table.tableID === tableId;
            });
            if (tableData) {
                // Tìm đúng index của món
                var itemData = tableData.infoMenu.find(function (item, index) {
                    return item.idItem === idItem;
                });
                if (itemData) {
                    setInputData(itemData.Mon);
                    setInputPrice(itemData.Gia);
                    setInputQuantity(itemData.SoLuong);
                    setInputMoney(itemData.ThanhTien);
                }
            }
        });
    }, [idItem]);

    React.useEffect(() => {
        if (inputPrice != '' && inputQuantity != '') {
            const money = inputPrice * inputQuantity;
            getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
                for (var i = 0; i < infoTable.length; i++) {
                    // Tìm đúng bàn
                    if (infoTable[i].tableID == tableId) {
                        for (var j = 0; j < infoTable[i].infoMenu.length; j++) {
                            // Tìm đúng index của món
                            if (infoTable[i].infoMenu[j].idItem === idItem) {
                                // Update laị giá trị mới sửa trong AsyncStorage infoTable
                                infoTable[i].infoMenu[j] = {
                                    idItem: idItem,
                                    Mon: inputData,
                                    Gia: inputPrice,
                                    SoLuong: inputQuantity,
                                    ThanhTien: money,
                                };
                                break;
                            }
                        }
                        // Tính tổng tiền sau mỗi lần update
                        var menuMoney = infoTable[i].infoMenu.reduce(function (total, infoMenuItem) {
                            return total + infoMenuItem.ThanhTien;
                        }, 0);

                        storeObjectValue(KEY_TABLE_ITEM, infoTable);
                        setInputMoney(money);
                        setTienMenu(menuMoney);
                        setTongTien(menuMoney + infoTable[i].tienGio);

                        break;
                    }
                }
            });
        }
        // Chỉ cần một trong 3 giá trị inputQuantity, inputPrice, inputData thay đổi sẽ nhảy vào useEffect này
        // Cần thêm inputData nếu không sẽ không lưu tên nếu gõ tên món sau cùng
    }, [inputQuantity, inputPrice, inputData]);

    // auto complete text input
    // Fail

    return (
        <View style={styles.container}>
            {/* Ghi món */}
            <View>
                <Text style={{ height: 30, display: showText }}>Tên Món</Text>
                <TextInputCustom
                    props={{
                        inputData: inputData,
                        setInputData: setInputData,
                        keyboardType: null,
                        minWidth: 100,
                        autoFocus: true,
                    }}
                />
            </View>
            {/* Gia */}
            <View>
                <Text style={{ height: 30, display: showText }}>Đơn Giá</Text>
                <TextInputCustom
                    props={{
                        inputData: inputPrice,
                        setInputData: setInputPrice,
                        keyboardType: 'numeric',
                        minWidth: 30,
                        autoFocus: false,
                    }}
                />
            </View>
            {/* So luong */}
            <View>
                <Text style={{ height: 30, display: showText }}>Số lượng</Text>
                <TextInputCustom
                    props={{
                        inputData: inputQuantity,
                        setInputData: setInputQuantity,
                        keyboardType: 'numeric',
                        minWidth: 30,
                        autoFocus: false,
                    }}
                />
            </View>
            {/* Thanh tien */}
            <View>
                <Text style={{ height: 30, display: showText }}>Thành tiền</Text>
                <Text
                    style={{
                        borderWidth: 1,
                        height: 50,
                        fontSize: 18,
                        backgroundColor: 'yellow',
                        color: 'black',
                        minWidth: 70,
                        textAlign: 'center', // align text horizatal(hai ben)
                        textAlignVertical: 'center', // align text (tren duoi)
                    }}
                >
                    {inputMoney}K
                </Text>
            </View>
            {/* Button Xóa món */}
            <View style={{ marginLeft: 8, marginBottom: 4 }}>
                <Text style={{ height: 30, textAlign: 'center', display: showText }}>Xóa món</Text>
                <Pressable
                    onPress={() => {
                        handleDeleteMon(tableId, idItem);
                    }}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                        },
                        { width: 50, height: 50, justifyContent: 'center' },
                    ]}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 18,
                            color: 'white',
                        }}
                    >
                        Xóa
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ccc',
    },
});
