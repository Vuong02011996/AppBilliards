import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import TextInputCustom from './TextInputCustom';
import { getDataString, storeDataString, storeObjectValue, getDataObject, removeValueOfKey } from '../utils';
import { KEY_MON, KEY_GIA, KEY_SO_LUONG, KEY_THANH_TIEN, KEY_MENU_ITEM, KEY_TABLE_ITEM } from '../utils';

const MenuItem = ({ props }) => {
    const { idItem, showText, tableId, handleDeleteMon } = props;
    console.log('handleDeleteMon: ', handleDeleteMon);
    console.log('idItem: ', idItem);
    console.log('render lai sau khi xoa 1: idItem: tableId', idItem, tableId);

    const [inputData, setInputData] = React.useState('');
    const [inputPrice, setInputPrice] = React.useState('');
    const [inputQuantity, setInputQuantity] = React.useState('');
    const [inputMoney, setInputMoney] = React.useState(0);
    console.log('inputData sau khi xoa', inputData);
    console.log('inputPrice sau khi xoa', inputPrice);
    console.log('inputQuantity sau khi xoa', inputQuantity);
    console.log('inputMoney sau khi xoa', inputMoney);
    // Chạy một lần khi render tới MenuItem nào trong menuItemList thì lấy giá trị từ storage hiển thị lên
    React.useEffect(() => {
        console.log('render lai sau khi xoa 2: idItem: tableId', idItem, tableId);

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
                    console.log('itemData: ', itemData);
                    setInputData(itemData.Mon);
                    setInputPrice(itemData.Gia);
                    setInputQuantity(itemData.SoLuong);
                    setInputMoney(itemData.ThanhTien);
                }
            }
        });
    }, [idItem]);

    React.useEffect(() => {
        console.log('render lai sau khi xoa 3: idItem: tableId', idItem, tableId);

        if (inputPrice != '' && inputQuantity != '') {
            const money = inputPrice * inputQuantity;
            getDataObject(KEY_TABLE_ITEM).then((infoTable) => {
                console.log('infoTable truoc thay doi gia, sl: ', infoTable);
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
                        break;
                    }
                }
                console.log('infoTable sau thay doi gia, sl: ', infoTable);

                storeObjectValue(KEY_TABLE_ITEM, infoTable);
                setInputMoney(money);
            });
        }
    }, [inputQuantity, inputPrice]);

    return (
        <View style={styles.container}>
            <View>
                {/* Trên android Text/ TextInput không có height sẽ không hiện */}
                {console.log('render lai sau khi xoa 4: idItem: tableId', idItem, tableId)}
                <Text style={{ height: 30, display: showText }}>Mon</Text>
                <TextInputCustom
                    props={{
                        inputData: inputData,
                        setInputData: setInputData,
                        keyboardType: null,
                        minWidth: 100,
                    }}
                />
            </View>

            {/* Gia */}
            <View>
                <Text style={{ height: 30, display: showText }}>Gia</Text>
                <TextInputCustom
                    props={{
                        inputData: inputPrice,
                        setInputData: setInputPrice,
                        keyboardType: 'numeric',
                        minWidth: 50,
                    }}
                />
            </View>
            {/* So luong */}
            <View>
                <Text style={{ height: 30, display: showText }}>So luong</Text>
                <TextInputCustom
                    props={{
                        inputData: inputQuantity,
                        setInputData: setInputQuantity,
                        keyboardType: 'numeric',
                        minWidth: 50,
                    }}
                />
            </View>
            {/* Thanh tien */}
            <View>
                <Text style={{ height: 30, display: showText }}>Thanh tien</Text>
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
                <Text style={{ height: 30, textAlign: 'center', display: showText }}>Xoa</Text>
                <Pressable
                    onPress={() => {
                        console.log('Xoa');
                        handleDeleteMon(tableId, idItem);
                    }}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                        },
                        { width: 70, height: 50, justifyContent: 'center' },
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
                        Xoa
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
