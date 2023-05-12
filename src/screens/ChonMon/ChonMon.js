/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import {updateMonDB, updateMonBanDB} from '../../utils/command';

function ChonMon({route, navigation}) {
  const [tatCaMon, setTatCaMon] = useState([]);
  const [monNuoc, setMonNuoc] = useState([]);
  const [bia, setBia] = useState([]);
  const [doAn, setDoAn] = useState([]);
  const [thuoc, setThuoc] = useState([]);

  const [filterMon, setFilterMon] = useState([]);
  const [monDuocChon, setMonDuocChon] = useState([]);
  const [soLuong, setSoLuong] = useState({});
  const [selectedType, setSelectedType] = useState('Tất cả');

  const {tableId, title} = route.params;

  // Load danh sách tất cả món
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Danh sach mon')
      .onSnapshot(querySnapshot => {
        const foodsList = [];
        const Waters = [];
        const Bias = [];
        const Doans = [];
        const Thuocs = [];

        querySnapshot.forEach(documentSnapshot => {
          const food = documentSnapshot.data();
          food.id = documentSnapshot.id;
          food.soLuong = 0;
          foodsList.push(food);
          if (food.Loai === 'nuoc') {
            Waters.push(food);
          }
          if (food.Loai === 'bia') {
            Bias.push(food);
          }
          if (food.Loai === 'do_an') {
            Doans.push(food);
          }
          if (food.Loai === 'thuoc') {
            Thuocs.push(food);
          }
        });

        setTatCaMon(foodsList);
        setMonNuoc(Waters);
        setBia(Bias);
        setDoAn(Doans);
        setThuoc(Thuocs);

        // ban đầu chọn tất cả món
        setFilterMon(foodsList);
        setSelectedType('all');
      });
    return unsubscribe;
  }, [title]);

  // Load danh sách món của bàn (có số lương) nếu đã chọn trước đó.
  useEffect(() => {
    firestore()
      .collection('Danh sach ban')
      .doc(title)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          // console.log('Dữ liệu của bàn: ', documentSnapshot.data());
          const data_table = documentSnapshot.data();
          const list_mon_cua_ban = data_table?.mon;
          if (list_mon_cua_ban) {
            setMonDuocChon(list_mon_cua_ban);
            const soLuongInit = {};
            list_mon_cua_ban.forEach(mon => {
              // set số lượng ban đầu bằng 0 cho mỗi món
              soLuongInit[mon.id] = mon.soLuong;
            });
            // console.log('soLuong truoc khi lây từ dữ liệu db: ', soLuong);

            setSoLuong(soLuongInit);
          }
        }
      });
  }, [title]);

  const handleThemMon = food => {
    const index = monDuocChon.findIndex(
      selectedFood => selectedFood.id === food.id,
    );
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
      newSelectedFoods[index] = {
        ...newSelectedFoods[index],
        soLuong: newSelectedFoods[index].soLuong + 1,
      };
      updateMonBanDB(title, newSelectedFoods);
      setMonDuocChon(newSelectedFoods);
      setSoLuong({
        ...soLuong,
        [food.id]: soLuong[food.id] + 1,
      });
    }
  };

  const handleBoMon = food => {
    const index = monDuocChon.findIndex(
      selectedFood => selectedFood.id === food.id,
    );
    if (index === -1) {
      // Món không có trong danh sách monDuocChon, không giảm số lượng
      return;
    } else if (monDuocChon[index].soLuong === 1) {
      // Món có trong danh sách monDuocChon và số lượng bằng 1, remove khỏi danh sách
      const newSelectedFoods = monDuocChon.filter(
        selectedFood => selectedFood.id !== food.id,
      );
      updateMonBanDB(title, newSelectedFoods);
      setMonDuocChon(newSelectedFoods);
    } else {
      // Món có trong danh sách monDuocChon và số lượng lớn hơn 1, chỉ giảm số lượng
      const newSelectedFoods = [...monDuocChon];
      newSelectedFoods[index] = {
        ...newSelectedFoods[index],
        soLuong: newSelectedFoods[index].soLuong - 1,
      };
      updateMonBanDB(title, newSelectedFoods);
      setMonDuocChon(newSelectedFoods);
    }
    setSoLuong({
      ...soLuong,
      [food.id]: soLuong[food.id] - 1,
    });
  };
  const chonTatCa = () => {
    setFilterMon(tatCaMon);
    setSelectedType('all');
  };
  const chonNuoc = () => {
    setFilterMon(monNuoc);
    setSelectedType('nuoc');
  };
  const chonBia = () => {
    setFilterMon(bia);
    setSelectedType('bia');
  };
  const chonDoAn = () => {
    setFilterMon(doAn);
    setSelectedType('do_an');
  };
  const chonThuoc = () => {
    setFilterMon(thuoc);
    setSelectedType('thuoc');
  };

  const getBackgroundColor = type => {
    if (type === selectedType) {
      return {backgroundColor: 'yellow'};
    }
    return {};
  };

  return (
    <View style={styles.container}>
      {/* add tabar ở đây */}
      <View style={styles.tab_bar}>
        <TouchableOpacity
          style={[styles.column_tab, getBackgroundColor('all')]}
          onPress={chonTatCa}>
          <Text style={styles.selectText}>Tất cả({tatCaMon.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.column_tab, getBackgroundColor('nuoc')]}
          onPress={chonNuoc}>
          <Text style={styles.selectText}>Nước({monNuoc.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.column_tab, getBackgroundColor('bia')]}
          onPress={chonBia}>
          <Text style={styles.selectText}>Bia({bia.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.column_tab, getBackgroundColor('do_an')]}
          onPress={chonDoAn}>
          <Text style={styles.selectText}>Đồ ăn({doAn.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.column_tab, getBackgroundColor('thuoc')]}
          onPress={chonThuoc}>
          <Text style={styles.selectText}>Thuốc({thuoc.length})</Text>
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
      {/* Render danh sách món */}
      <FlatList
        style={{height: 700, width: '100%', marginBottom: 50}}
        data={filterMon}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View key={item.id} style={styles.row_item}>
            <Text style={styles.column_name}>{item.TenMon}</Text>
            <Text style={styles.column_price}>{item.Gia}</Text>
            <Text style={styles.column_price}>{item.Loai}</Text>
            <TouchableOpacity
              style={styles.column_select}
              onPress={() => handleThemMon(item)}>
              <Text style={styles.text_button}>Tăng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.column_select}
              onPress={() => handleBoMon(item)}>
              <Text style={styles.text_button}>Giảm</Text>
            </TouchableOpacity>
            <Text style={styles.column_select}>{soLuong[item.id]}</Text>
          </View>
        )}
      />
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
    borderRightWidth: 1,
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
