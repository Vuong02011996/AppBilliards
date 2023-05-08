/* eslint-disable react-native/no-inline-styles */
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
  TouchableOpacity,
  Modal,
  TouchableHighlight,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TcpSocket from 'react-native-tcp-socket';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {deburr} from 'lodash';

import {updateBanDB, tinhTienMenu} from '../../utils/command';

function TableItem({route, navigation}) {
  // Danh sách chứa các Món(component MenuItem) để render
  const [menuItems, setMenuItems] = useState([]);
  const [tienMenu, setTienMenu] = useState(0);
  const [gioVao, setGioVao] = useState('Chưa đặt');
  const [gioNghi, setGioNghi] = useState('Chưa bấm');
  const [thoiGianChoi, setThoiGianChoi] = useState(0);
  const [tienGioMoiPhut, setTienGioMoiPhut] = useState(420);
  const [tienGio, setTienGio] = useState(0);
  const [tongTien, setTongTien] = useState(0);
  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [tienThoiLai, setTienThoiLai] = useState(0);

  const {tableId, title} = route.params;
  // Dùng title làm table Id và Id cho document của bàn .

  // Lần đầu tiên bấm vào bàn => bàn chưa có trên DB Danh sách bàn thì add vào DB
  // Nếu có rồi thì load dữ liệu ra.
  useEffect(() => {
    firestore()
      .collection('Danh sach ban')
      .doc(title)
      .get()
      .then(documentSnapshot => {
        // console.log('Danh sach ban exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          // Nếu bàn đã tạo trên DB load dữ liệu đang có của bàn
          const tableData = documentSnapshot.data();
          setGioVao(tableData.gioVao);
          setGioNghi(tableData.gioNghi);
          setThoiGianChoi(tableData.thoiGianChoi);
          setTienGio(tableData.tienGio);
          setTongTien(tableData.tongTien);

          const list_mon_cua_ban = tableData?.mon;
          if (list_mon_cua_ban) {
            // console.log('Mon cua ban', list_mon_cua_ban);
            setMenuItems(list_mon_cua_ban);
            const menuMoney = tinhTienMenu(list_mon_cua_ban);
            setTienMenu(menuMoney);
          }
        } else {
          // Nếu bàn chưa được tạo trên firebase thì tạo.
          firestore()
            .collection('Danh sach ban')
            .doc(title)
            .set({
              id_ban: title,
              gioVao: 'Chưa đặt',
              gioNghi: 'Chưa bấm',
              thoiGianChoi: 0,
              tienGio: 0,
              tienMenu: 0,
              tongTien: 0,
              mon: [],
              createdAt: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log('Table added!');
            });
        }
      });
  }, [title]);

  // Update lại tên title khi click vào từng bàn
  useEffect(() => {
    if (title) {
      navigation.setOptions({title: title});
    }
  }, [title, navigation]);

  // Nút chọn Món trên Header chuyển hướng đến trang màn hình chọn món.
  const handleAddMon = () => {
    navigation.navigate('ChonMon', {
      tableId,
      title,
    });
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleAddMon}
          menuMoney
          style={{
            backgroundColor: 'blue',
            padding: 8,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: 'white',
            }}>
            Chọn Món
          </Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  // Lắng nghe realtime món của bàn thay đổi từ chọn món render lại danh sách món.
  useEffect(() => {
    const subscriber = firestore()
      .collection('Danh sach ban')
      .doc(title)
      .onSnapshot(documentSnapshot => {
        const data_table = documentSnapshot.data();
        const list_mon_cua_ban = data_table?.mon;
        if (list_mon_cua_ban) {
          setMenuItems(list_mon_cua_ban);
          const menuMoney = tinhTienMenu(list_mon_cua_ban);
          setTienMenu(menuMoney);
        }
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [title]);

  // Thêm nút xóa món trên danh sách
  // Thêm vài nút thêm , bớt , nhớ update lại món của bàn
  const handleDeleteMon = (tableId, idItem) => {
    // Xem index xoá là item nào trong menuItemList rồi xóa bằng splice(index, 1)
  };

  async function readFieldDataDB(collection, document, field_data) {
    try {
      const docRef = firestore().collection(collection).doc(document);
      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        const value = data[field_data];
        console.log('value: ', value);

        return value;
      } else {
        console.log('Document does not exist!');
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Khi bấm đặt giờ vào update giờ vào vào danh sách bàn , tìm đúng bàn theo title.
  const handelDatGioVao = () => {
    function handleThayDoiGio() {
      const currTime = new Date().toLocaleString();
      updateBanDB(title, 'gioVao', currTime);
      setGioVao(currTime);
      setGioNghi('Chưa bấm');
    }
    if (gioVao != 'Chưa đặt') {
      Alert.alert(
        'Thay đổi giờ vào sẽ thay đổi hóa đơn',
        'Bạn có chắc chắn muốn thay đổi?',
        [
          {
            text: 'Có',
            onPress: handleThayDoiGio,
          },
          {
            text: 'Không',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
    } else {
      handleThayDoiGio();
    }
  };
  // Bấm giờ nghỉ hay thanh toán
  // Lấy giờ vào từ DB , tính toán thời gian chơi, tiền giờ tổng tiền update lại DB và useState
  const handelDatGioNghi = () => {
    async function handleThayDoiGioNghi() {
      const currTime = new Date().toLocaleString();
      // Đọc giờ vào của bàn hiện tại ở DB để tính toán.
      const valueGioVao = await readFieldDataDB(
        'Danh sach ban',
        title,
        'gioVao',
      );
      console.log('valueGioVao: ', valueGioVao);

      if (valueGioVao != 'Chưa đặt') {
        const timeClose = moment(currTime, 'HH:mm:ss, DD/MM/YYYY').valueOf();
        const timeStart = moment(valueGioVao, 'HH:mm:ss, DD/MM/YYYY').valueOf();

        console.log('currTime: ', currTime);
        console.log('timeClose: ', timeClose);
        console.log('timeStart: ', timeStart);
        let intervalTimeCost = timeClose - timeStart;
        if (intervalTimeCost > 0) {
          intervalTimeCost = Math.round(intervalTimeCost / 1000 / 60);
          const moneyTime = Math.ceil(
            (intervalTimeCost * tienGioMoiPhut) / 1000,
          );
          const totalMoney = moneyTime + tienMenu;
          firestore()
            .collection('Danh sach ban')
            .doc(title)
            .update({
              gioNghi: currTime,
              tienGio: moneyTime,
              thoiGianChoi: intervalTimeCost,
              tienMenu: tienMenu,
              tongTien: totalMoney,
            })
            .then(() => {
              console.log('Updated bấm giờ nghỉ thanh toán!');
            });

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
        Alert.alert(
          'Giờ vào chưa đặt!, Vui lòng đặt giờ vào rồi mới bấm giờ nghỉ!',
        );
      }
    }
    if (gioNghi != 'Chưa bấm') {
      Alert.alert(
        'Thay đổi giờ nghỉ sẽ thay đổi hóa đơn',
        'Bạn có chắc chắn muốn thay đổi?',
        [
          {
            text: 'Có',
            onPress: handleThayDoiGioNghi,
          },
          {
            text: 'Không',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
    } else {
      handleThayDoiGioNghi();
    }
  };

  // Thay đổi tiền giờ mỗi phút
  // Tính toán lại tiền giờ và tổng tiền
  const handelChangeTienMoiPhut = newTienGioMoiPhut => {
    const valueGioVao = readFieldDataDB('Danh sach ban', title, 'gioVao');
    const valueGioNghi = readFieldDataDB('Danh sach ban', title, 'gioNghi');
    const valueThoiGianChoi = readFieldDataDB(
      'Danh sach ban',
      title,
      'gioNghi',
    );

    if (valueGioVao !== 'Chưa đặt' && valueGioNghi !== 'Chưa đặt') {
      const moneyTime = (valueThoiGianChoi * newTienGioMoiPhut) / 1000;
      const totalMoney = moneyTime + tienMenu;
      setTienGio(moneyTime);
      setTongTien(totalMoney);
    }
    setTienGioMoiPhut(newTienGioMoiPhut);
  };

  // Handle đặt lại
  // Update lại document của bàn hiện tại vói tất cả thông tin reset
  const handelReset = () => {
    const handleDatLaiHoaDon = () => {
      firestore()
        .collection('Danh sach ban')
        .doc(title)
        .update({
          gioVao: 'Chưa đặt',
          gioNghi: 'Chưa bấm',
          thoiGianChoi: 0,
          tienGio: 0,
          tienMenu: 0,
          tongTien: 0,
          mon: [],
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('Updated bấm giờ nghỉ thanh toán!');
        });

      setTienMenu(0);
      setGioVao('Chưa đặt');
      setGioNghi('Chưa bấm');
      setThoiGianChoi(0);
      setTienGio(0);
      setTongTien(0);
      setTienKhachDua(0);
      setTienThoiLai(0);
    };
    if (gioVao != 'Chưa đặt') {
      Alert.alert(
        'Đặt lại sẽ xóa hóa đơn hiện tại',
        'Bạn có chắc chắn muốn xóa không?',
        [
          {
            text: 'Có',
            onPress: handleDatLaiHoaDon,
          },
          {
            text: 'Không',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
    } else {
      handleDatLaiHoaDon();
    }
  };

  // handle thối lại tiên
  const handelThoiTien = newTienKhachDua => {
    if (newTienKhachDua > 0) {
      setTienKhachDua(newTienKhachDua);
      setTienThoiLai(newTienKhachDua - tongTien);
    } else {
      setTienKhachDua(0);
      setTienThoiLai(0);
    }
  };

  const convertTV = string => {
    const newStr = deburr(string);
    // console.log('newStr: ', newStr);
    return newStr;
  };

  // convertTV('Nước uống');
  //   console.log('NFD: ', NFD);

  const getData = () => {
    console.log('menuItems: ', menuItems);

    const data = `
          ---------------------------
                    BIDA HVK
          Tinh Phong, Son Tinh, Quang Ngai
          ---------------------------
              PHIEU THANH TOAN
              Ban: ${tableId}

          Mat hang: 
          ---------------------------
          Ten     SoLuong   Gia   ThanhTien
          ${menuItems
            .map((item, index) => {
              let tenMon = convertTV(item.TenMon);
              tenMon = tenMon.padEnd(10, ' ');
              let soLuong = item.soLuong;
              soLuong = soLuong.toString().padEnd(2, ' ');
              let gia = item.Gia;
              gia = gia.toString().padEnd(4, ' ');
              let thanh_tien = soLuong * gia;
              // thanh_tien = thanh_tien.map(str => str.padEnd(10, ' '));

              if (index === 0) {
                return `${tenMon}${soLuong}     ${gia}   ${thanh_tien} 000d\n`;
              }

              return `          ${tenMon}${soLuong}     ${gia}   ${thanh_tien} 000d\n`;
            })
            .join('')}
          Tien menu:    ${tienMenu} 000d
          ---------------------------

          Thoi gian vao: ${gioVao}
          Thoi gian ra: ${gioNghi}
          Thoi gian choi:   ${thoiGianChoi} phut
          Tien gio:   ${tienGio} 000d   (${Math.round(tienGioMoiPhut * 60)}/Gio)

          TONG CONG:  ${tongTien} 000d
          Cam on quy khach! Hen gap lai!
          --------------------------




        






          `;

    // console.log(data);
    return data;
  };

  // Handle In hóa đơn
  const handelInHoaDon = () => {
    console.log('Printing...');
    const options = {
      port: 9100,
      host: '192.168.1.133',
      // localAddress: '192.168.1.133',
      // reuseAddress: true,
      // localPort: 20000,
      interface: 'wifi',
    };

    const data = getData();
    console.log('data:', data);

    const client = TcpSocket.createConnection(options, () => {
      // Write on the socket
      // client.write('Hello server!');

      client.write(data, () => {
        console.log('Data sent to printer');
      });

      console.log('Page cut command sent 1');

      // Close socket
      client.destroy();
    });
  };

  // Tính lại tiền thừa khi có tiền khách đưa mỗi khi tổng tiền thay đổi
  useEffect(() => {
    if (tienKhachDua > 0) {
      setTienThoiLai(tienKhachDua - tongTien);
    }
  }, [tongTien, tienKhachDua]);

  // Chỉnh sửa giá và số lượng
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');

  const handleEdit = item => {
    setSelectedItem(item);
    setModalVisible(true);
    setEditedPrice(item.Gia.toString());
    setEditedQuantity(item.soLuong.toString());
  };

  const handleSave = () => {
    // Thực hiện lưu các thông tin đã chỉnh sửa
    const updatedItem = {
      ...selectedItem,
      Gia: parseFloat(editedPrice),
      soLuong: parseInt(editedQuantity),
    };
    // Thực hiện các xử lý khác tại đây, ví dụ như gửi request lưu thông tin
    setSelectedItem(null);
    setModalVisible(false);
  };
  const renderItem = ({item}) => {
    const totalPrice = item.Gia * item.soLuong;
    return (
      <TouchableOpacity onPress={() => handleEdit(item)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
          }}>
          <Text style={styles.col_name}>{item.TenMon}</Text>
          <Text style={styles.col_price}>{item.Gia}</Text>
          <Text style={styles.col_soLuong}>{item.soLuong}</Text>
          <Text style={styles.col_thanh_tien}>{totalPrice}</Text>
          {/* <Text style={styles.xoa_mon}>Xóa</Text> */}
        </View>
      </TouchableOpacity>
    );
  };
  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
        }}>
        <Text style={styles.col_name}>Tên Món</Text>
        <Text style={styles.col_price}>Giá</Text>
        <Text style={styles.col_soLuong}>Số lượng</Text>
        <Text style={styles.col_thanh_tien}>Thành tiền</Text>
        {/* <Text style={styles.col_thanh_tien}>Bỏ món</Text> */}
      </View>
    );
  };

  return (
    <View>
      <TouchableWithoutFeedback>
        {/* FlatList in ScrollView
            https://stackoverflow.com/questions/67623952/error-virtualizedlists-should-never-be-nested-inside-plain-scrollviews-with-th */}
        <View style={{marginHorizontal: 8}}>
          <View>
            {/* <ScrollView horizontal={true} style={{ width: '100%' }}> */}
            <FlatList
              data={menuItems}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ListHeaderComponent={renderHeader}
            />
          </View>

          {/* Thông tin hóa đơn */}
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.textTongTienThucDon, {minWidth: 246}]}>
                Tổng tiền thực đơn:
              </Text>
              <Text style={styles.textTongTienThucDon}>{tienMenu}K</Text>
            </View>
            {/* Giờ vào */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={styles.textGio}>Giờ vào: </Text>
              <Text style={styles.textGio}>{gioVao} </Text>
              <Pressable
                onPress={handelDatGioVao}
                style={({pressed}) => [
                  styles.buttonDatGio,
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                  },
                ]}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    color: 'white',
                  }}>
                  Đặt giờ vào
                </Text>
              </Pressable>
            </View>
            {/* Giờ nghỉ */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.textGio}>Giờ nghỉ: </Text>
              <Text style={styles.textGio}>{gioNghi} </Text>
              <Pressable
                onPress={handelDatGioNghi}
                style={({pressed}) => [
                  styles.buttonDatGio,
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                  },
                ]}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    color: 'white',
                  }}>
                  Bấm giờ nghỉ
                </Text>
              </Pressable>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.textThoiGianChoi, {minWidth: 246}]}>
                Thời gian chơi:{' '}
              </Text>
              <Text style={styles.textThoiGianChoi}>{thoiGianChoi} phút</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.textTongTien, {minWidth: 246}]}>
                Tiền Giờ:
              </Text>
              <Text style={styles.textTongTien}>{tienGio}K</Text>
            </View>
            <Text
              style={[
                styles.textTongTien,
                {color: '#000', marginVertical: 4, fontSize: 20},
              ]}>
              Tổng tiền thanh toán: {tongTien}K
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.textThoiGianChoi,
                  {minWidth: 246, color: '#5f5151', fontWeight: '500'},
                ]}>
                Tiền khách đưa:
              </Text>
              <TextInput
                style={styles.textInputTienKhachDua}
                keyboardType="numeric"
                onChangeText={handelThoiTien}>
                {tienKhachDua}
              </TextInput>
              <Text
                style={[
                  styles.textThoiGianChoi,
                  {minWidth: 246, color: '#000', fontWeight: '500'},
                ]}>
                K
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.textThoiGianChoi,
                  {minWidth: 246, color: '#5f5151', fontWeight: '500'},
                ]}>
                Tiền thừa:
              </Text>
              <Text
                style={[
                  styles.textThoiGianChoi,
                  {minWidth: 246, color: '#000', fontWeight: '500'},
                ]}>
                {tienThoiLai}K
              </Text>
            </View>

            {/* Tiền giờ mỗi phút */}
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={styles.textTienGioMoiPhut}>Đơn giá mỗi phút:</Text>

              <TextInput
                style={styles.textInputChangeTienMoiPhut}
                keyboardType="numeric"
                onChangeText={handelChangeTienMoiPhut}>
                {tienGioMoiPhut}
              </TextInput>

              <Text style={styles.textTienGioMoiPhut}>đồng</Text>
              <Text style={styles.textTienGioMoiPhut}>
                ({(tienGioMoiPhut * 60) / 1000}K/giờ)
              </Text>
            </View>
            {/*  Button đặt lại và in hóa đơn */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* In hóa đơn */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginTop: 8,
                }}>
                <Pressable
                  onPress={handelInHoaDon}
                  style={({pressed}) => [
                    styles.buttonDatGio,
                    {
                      backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                    },
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: 'white',
                    }}>
                    In hóa đơn
                  </Text>
                </Pressable>
              </View>
              {/* Đặt lại */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 8,
                }}>
                <Pressable
                  onPress={handelReset}
                  style={({pressed}) => [
                    styles.buttonDatGio,
                    {
                      backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                    },
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: 'white',
                    }}>
                    Đặt lại
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View>
          <Text style={{fontSize: 20}}>{selectedItem?.TenMon}</Text>
          <TextInput
            style={{marginTop: 20, fontSize: 16}}
            placeholder="Nhập giá"
            value={editedPrice}
            onChangeText={text => setEditedPrice(text)}
          />
          <TextInput
            style={{marginTop: 10, fontSize: 16}}
            placeholder="Nhập số lượng"
            value={editedQuantity}
            onChangeText={text => setEditedQuantity(text)}
          />
          <TouchableOpacity
            style={{marginTop: 20, backgroundColor: 'blue', padding: 10}}
            onPress={handleSave}>
            <Text style={{color: 'white'}}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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

  col_name: {
    flex: 1,
    // textAlign: 'center',
  },
  col_price: {
    flex: 1,
    textAlign: 'center',
    // borderWidth: 1,
  },
  col_price_input: {
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
    borderWidth: 1,
  },
  col_soLuong: {
    flex: 1,
    textAlign: 'center',
  },
  col_thanh_tien: {
    flex: 1,
    textAlign: 'center',
  },
  modal_edit: {
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'white',
    height: '50%',
    margin: 20,
  },
  xoa_mon: {
    backgroundColor: 'red',
    padding: 4,
    textAlign: 'center',
    width: 10,
    flex: 1,
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
