import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView, TextInput } from 'react-native';

function ChonMon({ route, navigation }) {
    const [tatCaMon, setTatCaMon] = useState([]);
    const [monDuocChon, setMonDuocChon] = useState([]);
    const [soLuong, setSoLuong] = useState({});

    const { tableId, title } = route.params;

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Danh sach mon')
            .onSnapshot((querySnapshot) => {
                const foodsList = [];
                // const soLuongInit = {};

                querySnapshot.forEach((documentSnapshot) => {
                    const food = documentSnapshot.data();
                    food.id = documentSnapshot.id;
                    food.soLuong = 0;
                    foodsList.push(food);
                    // // set số lượng ban đầu bằng 0 cho mỗi món
                    // soLuongInit[food.id] = 0;
                });
                // console.log('soLuongInit ban đầu: ', soLuongInit);

                setTatCaMon(foodsList);
                // setSoLuong(soLuongInit);
            });
        return unsubscribe;
    }, []);

    useEffect(() => {
        firestore()
            .collection('Danh sach ban')
            .doc(title)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    // console.log('Dữ liệu của bàn: ', documentSnapshot.data());
                    const data_table = documentSnapshot.data();
                    const list_mon_cua_ban = data_table?.mon;
                    if (list_mon_cua_ban) {
                        console.log('Mon cua ban', list_mon_cua_ban);
                        setMonDuocChon(list_mon_cua_ban);
                        const soLuongInit = {};
                        list_mon_cua_ban.forEach((mon) => {
                            // set số lượng ban đầu bằng 0 cho mỗi món
                            soLuongInit[mon.id] = mon.soLuong;
                        });
                        // console.log('soLuong truoc khi lây từ dữ liệu db: ', soLuong);

                        setSoLuong(soLuongInit);
                    }
                }
            });
    }, [title]);

    const updateBanDB = (data) => {
        firestore()
            .collection('Danh sach ban')
            .doc(title)
            .update({
                mon: data,
            })
            .then(() => {
                console.log('Mon updated!');
            });
    };

    const handleThemMon = (food) => {
        const index = monDuocChon.findIndex((selectedFood) => selectedFood.id === food.id);
        if (index === -1) {
            // Món chưa có trong danh sách monDuocChon, thêm vào DB update số lượng
            food.soLuong = 1;
            updateBanDB([...monDuocChon, food]);
            setMonDuocChon([...monDuocChon, food]);
            setSoLuong({
                ...soLuong,
                [food.id]: 1,
            });
        } else {
            // Món đã có trong danh sách monDuocChon
            const newSelectedFoods = [...monDuocChon];
            newSelectedFoods[index] = { ...newSelectedFoods[index], soLuong: newSelectedFoods[index].soLuong + 1 };
            updateBanDB(newSelectedFoods);
            setMonDuocChon(newSelectedFoods);
            setSoLuong({
                ...soLuong,
                [food.id]: soLuong[food.id] + 1,
            });
        }
    };

    const handleBoMon = (food) => {
        const index = monDuocChon.findIndex((selectedFood) => selectedFood.id === food.id);
        if (index === -1) {
            // Món không có trong danh sách monDuocChon, không giảm số lượng
            return;
        } else if (monDuocChon[index].soLuong === 1) {
            // Món có trong danh sách monDuocChon và số lượng bằng 1, remove khỏi danh sách
            const newSelectedFoods = monDuocChon.filter((selectedFood) => selectedFood.id !== food.id);
            updateBanDB(newSelectedFoods);
            setMonDuocChon(newSelectedFoods);
        } else {
            // Món có trong danh sách monDuocChon và số lượng lớn hơn 1, chỉ giảm số lượng
            const newSelectedFoods = [...monDuocChon];
            newSelectedFoods[index] = { ...newSelectedFoods[index], soLuong: newSelectedFoods[index].soLuong - 1 };
            updateBanDB(newSelectedFoods);
            setMonDuocChon(newSelectedFoods);
        }
        setSoLuong({
            ...soLuong,
            [food.id]: soLuong[food.id] - 1,
        });
    };

    const updateMonDB = (food_id, field_data, data) => {
        firestore()
            .collection('Danh sach mon')
            .doc(food_id)
            .update({
                [field_data]: data,
            })
            .then(() => {
                console.log('Mon updated!');
            });
    };
    const handleThayDoiGia = (food_id, value) => {
        console.log('food_id, value: ', food_id, value);
        updateMonDB(food_id, 'Gia', value);
        // update lai gia cua món được chọn
        const index = monDuocChon.findIndex((selectedFood) => selectedFood.id === food_id);
        const newSelectedFoods = [...monDuocChon];
        newSelectedFoods[index] = { ...newSelectedFoods[index], Gia: value };
        updateBanDB(newSelectedFoods);
        setMonDuocChon(newSelectedFoods);
    };
    const handleThayDoiSoLuong = (food_id, value) => {
        console.log('food_id, value: ', food_id, value);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header_row}>
                <Text style={styles.column_name}>Tên Món</Text>
                <Text style={styles.column_price}>Đơn Giá</Text>
                <Text style={styles.column_price}>Loại</Text>
                <Text style={styles.column_select}>Thêm</Text>
                <Text style={styles.column_select}>Bớt</Text>
                <Text style={styles.column_select}>Số lượng</Text>
            </View>
            <View>
                {tatCaMon.map((food) => (
                    <View key={food.id} style={styles.row_item}>
                        <Text style={styles.column_name}>{food.TenMon}</Text>
                        <Text style={styles.column_price}>{food.Gia}</Text>
                        {/* <TextInput
                            style={styles.column_price}
                            keyboardType={'numeric'}
                            defaultValue={food.Gia}
                            autoFocus={false}
                            onChangeText={(newInputData) => handleThayDoiGia(food.id, newInputData)}
                        /> */}
                        <Text style={styles.column_price}>{food.Loai}</Text>
                        <TouchableOpacity style={styles.column_select} onPress={() => handleThemMon(food)}>
                            <Text style={styles.text_button}>Thêm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.column_select} onPress={() => handleBoMon(food)}>
                            <Text style={styles.text_button}>Bớt</Text>
                        </TouchableOpacity>
                        <Text style={styles.column_select}>{soLuong[food.id]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

export default ChonMon;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    header_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        fontWeight: 'bold',
    },
    column_name: {
        flex: 1,
    },
    column_price: {
        flex: 1,
        textAlign: 'center',
        // borderWidth: 1,
    },
    column_select: {
        flex: 1,
        textAlign: 'center',
    },
    text_button: {
        textAlign: 'center',
        backgroundColor: '#ccc',
        marginRight: 10,
        paddingVertical: 10,
    },
});
