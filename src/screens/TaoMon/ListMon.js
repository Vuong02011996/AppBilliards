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
  Dimensions,
} from 'react-native';

function ListMon({route, navigation}) {
  const [tatCaMon, setTatCaMon] = useState([]);
  const [monNuoc, setMonNuoc] = useState([]);
  const [bia, setBia] = useState([]);
  const [doAn, setDoAn] = useState([]);
  const [thuoc, setThuoc] = useState([]);
  const [filterMon, setFilterMon] = useState([]);
  const [selectedType, setSelectedType] = useState('Tất cả');

  //   const {tableId, title} = route.params;

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
  }, []);

  // Load danh sách món của bàn (có số lương) nếu đã chọn trước đó.

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
      </View>
      <ScrollView style={{height: 300, width: '100%'}}>
        <View>
          {filterMon.map(food => (
            <View key={food.id} style={styles.row_item}>
              <Text style={styles.column_name}>{food.TenMon}</Text>
              <Text style={styles.column_price}>{food.Gia}</Text>
              <Text style={styles.column_price}>{food.Loai}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default ListMon;

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
