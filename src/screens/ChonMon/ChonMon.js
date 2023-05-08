/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { updateMonDB, updateMonBanDB } from '../../utils/command';

function ChonMon({ route, navigation }) {
    const [tatCaMon, setTatCaMon] = useState([]);
    const [monNuoc, setMonNuoc] = useState([]);
    const [doAn, setDoAn] = useState([]);
    const [filterMon, setFilterMon] = useState([]);
    const [monDuocChon, setMonDuocChon] = useState([]);
    const [soLuong, setSoLuong] = useState({});
    const [selectedType, setSelectedType] = useState('Tất cả');

    const { tableId, title } = route.params;

    // Load danh sách tất cả món
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Danh sach mon')
            .onSnapshot((querySnapshot) => {
                const foodsList = [];
                const Waters = [];
                const Doans = [];

                querySnapshot.forEach((documentSnapshot) => {
                    const food = documentSnapshot.data();
                    food.id = documentSnapshot.id;
                    food.soLuong = 0;
                    foodsList.push(food);
                    if (food.Loai === 'nuoc') {
                        Waters.push(food);
                    }
                    if (food.Loai === 'doan') {
                        Doans.push(food);
                    }
                });

                setTatCaMon(foodsList);
                setDoAn(Doans);
                setMonNuoc(Waters);

                // ban đầu chọn tất cả món
                setFilterMon(foodsList);
                setSelectedType('all');
            });
        return unsubscribe;
    }, []);

    // Load danh sách món của bàn (có số lương) nếu đã chọn trước đó.
    console.log('food ban đầu: ', tatCaMon);
    console.log('Nuoc: ', monNuoc);
    console.log('Do an: ', doAn);

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

    const handleThemMon = (food) => {
        const index = monDuocChon.findIndex((selectedFood) => selectedFood.id === food.id);
        if (index === -1) {
            // Món chưa có trong danh sách monDuocChon, thêm vào DB update số lượng
            food.soLuong = 1;
            updateMonBanDB(title, [...monDuocChon, food]);
            setMonDuocChon([...monDuocChon, food]);
            setSoLuong({
                ...soLuong,
                [food.id]: 1,
            });
        } else {
            // Món đã có trong danh sách monDuocChon
            const newSelectedFoods = [...monDuocChon];
            newSelectedFoods[index] = { ...newSelectedFoods[index], soLuong: newSelectedFoods[index].soLuong + 1 };
            updateMonBanDB(title, newSelectedFoods);
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
            updateMonBanDB(title, newSelectedFoods);
            setMonDuocChon(newSelectedFoods);
        } else {
            // Món có trong danh sách monDuocChon và số lượng lớn hơn 1, chỉ giảm số lượng
            const newSelectedFoods = [...monDuocChon];
            newSelectedFoods[index] = { ...newSelectedFoods[index], soLuong: newSelectedFoods[index].soLuong - 1 };
            updateMonBanDB(title, newSelectedFoods);
            setMonDuocChon(newSelectedFoods);
        }
        setSoLuong({
            ...soLuong,
            [food.id]: soLuong[food.id] - 1,
        });
    };

    const handleThayDoiGia = (food_id, value) => {
        console.log('food_id, value: ', food_id, value);
        updateMonDB(food_id, 'Gia', value);
        // update lai gia cua món được chọn
        const index = monDuocChon.findIndex((selectedFood) => selectedFood.id === food_id);
        const newSelectedFoods = [...monDuocChon];
        newSelectedFoods[index] = { ...newSelectedFoods[index], Gia: value };
        updateMonBanDB(title, newSelectedFoods);
        setMonDuocChon(newSelectedFoods);
    };
    const handleThayDoiSoLuong = (food_id, value) => {
        console.log('food_id, value: ', food_id, value);
    };

    console.log('selectedType ', selectedType);

    const chonTatCa = () => {
        setFilterMon(tatCaMon);
        setSelectedType('all');
    };
    const chonNuoc = () => {
        setFilterMon(monNuoc);
        setSelectedType('nuoc');
    };
    const chonDoAn = () => {
        setFilterMon(doAn);
        setSelectedType('doan');
    };

    const getBackgroundColor = (type) => {
        if (type === selectedType) {
            return { backgroundColor: 'yellow' };
        }
        return {};
    };

    return (
        <View style={styles.container}>
            {/* add tabar ở đây */}
            <View style={styles.tab_bar}>
                <TouchableOpacity style={[styles.column_tab, getBackgroundColor('all')]} onPress={chonTatCa}>
                    <Text style={styles.selectText}>Tất cả món</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.column_tab, getBackgroundColor('nuoc')]} onPress={chonNuoc}>
                    <Text style={styles.selectText}>Nước</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.column_tab, getBackgroundColor('doan')]} onPress={chonDoAn}>
                    <Text style={styles.selectText}>Đồ ăn</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.header_row}>
                <Text style={styles.column_name}>Tên Món</Text>
                <Text style={styles.column_price}>Đơn Giá</Text>
                <Text style={styles.column_price}>Loại</Text>
                <Text style={styles.column_select}>Thêm</Text>
                <Text style={styles.column_select}>Bớt</Text>
                <Text style={styles.column_select}>Số lượng</Text>
            </View>
            <View>
                {filterMon.map((food) => (
                    <View key={food.id} style={styles.row_item}>
                        <Text style={styles.column_name}>{food.TenMon}</Text>
                        <Text style={styles.column_price}>{food.Gia}</Text>
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

    // tab bar
    tab_bar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    column_tab: {
        marginHorizontal: 2,
        padding: 10,
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
