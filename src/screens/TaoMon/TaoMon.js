/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ListMon from './ListMon';

export default function TaoMon() {
  const [tenMon, setTenMon] = useState('');
  const [gia, setGia] = useState('');
  const [loai, setLoai] = useState('Chưa chọn');
  const [selectedType, setSelectedType] = useState('Chưa chọn');

  const handleSubmit = () => {
    if (loai === 'Chưa chọn') {
      console.log('Thông báo chọn loại !');
      Alert.alert('Chưa chọn loại');
      return;
    }
    firestore()
      .collection('Danh sach mon')
      .doc(tenMon)
      .set({
        TenMon: tenMon,
        Gia: gia,
        Loai: loai,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log('Đã thêm món!');
      })
      .catch(error => console.error('Có lỗi khi thêm món: ', error));

    console.log('Đã thêm món thành công!');

    setTenMon('');
    setGia('');
    setLoai('Chưa chọn');
    setSelectedType('Chưa chọn');
    Alert.alert('Đã thêm món');
  };

  const getBackgroundColor = type => {
    if (type === selectedType) {
      return {backgroundColor: 'yellow'};
    }
    return {};
  };

  const chonLoai = loai => {
    setSelectedType(loai);
    setLoai(loai);
  };
  return (
    <View style={styles.container}>
      {/* Thêm món */}
      <View style={styles.them_mon}>
        <Text style={styles.title_text}>Thêm món ăn hoặc đồ uống: </Text>
        <TextInput
          style={styles.text_input}
          placeholder="Tên món"
          value={tenMon}
          onChangeText={text => setTenMon(text)}
        />

        <TextInput
          style={styles.text_input}
          placeholder="Giá"
          keyboardType="numeric"
          value={gia}
          onChangeText={text => setGia(text)}
        />
        <Text style={styles.selectText}>Chọn Loại </Text>
        <View style={styles.tab_bar}>
          <TouchableOpacity
            style={[styles.column_tab, getBackgroundColor('nuoc')]}
            onPress={() => chonLoai('nuoc')}>
            <Text style={styles.selectText}>Nước</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.column_tab, getBackgroundColor('bia')]}
            onPress={() => chonLoai('bia')}>
            <Text style={styles.selectText}>Bia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.column_tab, getBackgroundColor('do_an')]}
            onPress={() => chonLoai('do_an')}>
            <Text style={styles.selectText}>Đồ ăn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.column_tab, getBackgroundColor('thuoc')]}
            onPress={() => chonLoai('thuoc')}>
            <Text style={styles.selectText}>Thuốc</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.button_them}>
          <Button title="Thêm" onPress={handleSubmit} />
        </View>
      </View>
      {/* Danh sách món */}
      <View style={styles.danhsachmon}>
        <Text style={styles.title_text}> Danh sách món</Text>
        <ListMon />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  them_mon: {
    backgroundColor: '#eee',
  },
  title_text: {
    marginVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  text_input: {
    borderWidth: 1,
    height: 40,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  // tab bar
  tab_bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column_tab: {
    marginHorizontal: 2,
    backgroundColor: '#ccc',
    padding: 10,
    // height: 20,
    marginRight: 4,
  },
  button_them: {
    backgroundColor: 'red',
    margin: 20,
  },
});
