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
import {getData} from '../../utils/in_bill';

import {
  tinhTienMenu,
  convertMinutesToTimeString,
  readFieldDataDB,
} from '../../utils/command';

function TableItem({route, navigation}) {
  // Danh sách chứa các Món(component MenuItem) để render
  const {tableId, title, price} = route.params;

  const [menuItems, setMenuItems] = useState([]);
  const [tienMenu, setTienMenu] = useState(0);

  const [gioVao, setGioVao] = useState('Chưa đặt');
  const [gioNghi, setGioNghi] = useState('Chưa thanh toán');
  const [thoiGianChoi, setThoiGianChoi] = useState(0);
  const [tienGioMoiPhut, setTienGioMoiPhut] = useState(price);

  const [tienGio, setTienGio] = useState(0);
  const [giamGia, setGiamGia] = useState(30);
  const [tienGioConLai, setTienGioConLai] = useState(0);

  const [tongTien, setTongTien] = useState(0);
  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [tienThoiLai, setTienThoiLai] = useState(0);

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
          // console.log('table Data: ', tableData);
          setGioVao(tableData.gioVao);
          setGioNghi(tableData.gioNghi);
          setThoiGianChoi(tableData.thoiGianChoi);
          setTienGio(tableData.tienGio);
          setTienGioConLai(tableData.tienGioConLai);
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
              gioNghi: 'Chưa thanh toán',
              thoiGianChoi: 0,
              tienGio: 0,
              tienGioConLai: 0,
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
  // HeaderRight Chọn Món
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

  // Lắng nghe realtime món của bàn thay đổi từ chọn món, giờ chơi render lại danh sách món.
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
          const totalMoney = data_table.tienGioConLai + menuMoney;
          setTienMenu(menuMoney);
          setTongTien(totalMoney);
        }
        console.log('data_table', data_table);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [title]);

  // Khi bấm đặt giờ vào update giờ vào vào danh sách bàn , tìm đúng bàn theo title.
  const handelDatGioVao = () => {
    function handleThayDoiGio() {
      const currTime = new Date().toLocaleString();
      firestore()
        .collection('Danh sach ban')
        .doc(title)
        .update({
          gioVao: currTime,
          gioNghi: 'Chưa thanh toán',
          thoiGianChoi: 0,
          tienGio: 0,
          tienGioConLai: 0,
          tongTien: tienMenu,
        })
        .then(() => {
          console.log('Updated bấm giờ vào!');
        });
      setGioVao(currTime);
      setGioNghi('Chưa thanh toán');
      setThoiGianChoi(0);
      setTienGio(0);
      setTienGioConLai(0);
      setTongTien(tienMenu);
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
        const timeClose = moment(currTime, 'HH:mm, DD/MM/YYYY').valueOf();
        const timeStart = moment(valueGioVao, 'HH:mm, DD/MM/YYYY').valueOf();
        let intervalTimeCost = timeClose - timeStart;
        if (intervalTimeCost > 0) {
          intervalTimeCost = Math.round(intervalTimeCost / 1000 / 60);
          const moneyTime = Math.ceil(
            (intervalTimeCost * tienGioMoiPhut) / 1000,
          );
          const tienGioGiamGia = Math.ceil(
            moneyTime - (moneyTime * giamGia) / 100,
          );

          const totalMoney = moneyTime + tienMenu;

          firestore()
            .collection('Danh sach ban')
            .doc(title)
            .update({
              gioNghi: currTime,
              tienGio: moneyTime,
              tienGioConLai: tienGioGiamGia,
              thoiGianChoi: intervalTimeCost,
              tienMenu: tienMenu,
              tongTien: totalMoney,
            })
            .then(() => {
              console.log('Updated bấm giờ nghỉ thanh toán!');
            });

          setThoiGianChoi(intervalTimeCost);
          setTienGio(moneyTime);
          setTienGioConLai(tienGioGiamGia);
          setTongTien(totalMoney);
          setGioNghi(currTime);
        } else {
          Alert.alert('Giờ vào lớn hơn giờ nghỉ');
        }
      } else {
        Alert.alert(
          'Giờ vào chưa đặt!, Vui lòng đặt giờ vào rồi mới bấm giờ nghỉ!',
        );
      }
    }
    if (gioNghi != 'Chưa thanh toán') {
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

  // Giảm giá
  const handelInputGiamGia = value => {
    if (tienGio > 0) {
      const tienGioGiamGia = Math.ceil(tienGio - (tienGio * value) / 100);
      setTienGioConLai(tienGioGiamGia);
    }
    setGiamGia(value);
  };
  const handleButtonGiamGia = () => {
    if (tienGio > 0) {
      const tienGioGiamGia = Math.ceil(tienGio - (tienGio * giamGia) / 100);
      setTienGioConLai(tienGioGiamGia);
    }
  };

  // Thay đổi tiền giờ mỗi phút
  // Tính toán lại tiền giờ và tổng tiền
  async function handelChangeTienMoiPhut(newTienGioMoiPhut) {
    const valueGioVao = await readFieldDataDB('Danh sach ban', title, 'gioVao');
    const valueGioNghi = await readFieldDataDB(
      'Danh sach ban',
      title,
      'gioNghi',
    );
    const valueThoiGianChoi = await readFieldDataDB(
      'Danh sach ban',
      title,
      'thoiGianChoi',
    );

    if (valueGioVao !== 'Chưa đặt' && valueGioNghi !== 'Chưa đặt') {
      const moneyTime = Math.ceil(
        (valueThoiGianChoi * newTienGioMoiPhut) / 1000,
      );
      const tienGioGiamGia = Math.ceil(moneyTime - (moneyTime * giamGia) / 100);
      const totalMoney = moneyTime + tienMenu;
      setTienGio(moneyTime);
      setTienGioConLai(tienGioGiamGia);
      setTongTien(totalMoney);
    }
    setTienGioMoiPhut(newTienGioMoiPhut);
  }

  // Handle đặt lại
  // Update lại document của bàn hiện tại vói tất cả thông tin reset
  const handelReset = () => {
    const handleDatLaiHoaDon = () => {
      firestore()
        .collection('Danh sach ban')
        .doc(title)
        .update({
          gioVao: 'Chưa đặt',
          gioNghi: 'Chưa thanh toán',
          thoiGianChoi: 0,
          tienGio: 0,
          tienGioConLai: 0,
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
      setGioNghi('Chưa thanh toán');
      setThoiGianChoi(0);
      setTienGio(0);
      setTienGioConLai(0);
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

  // Handle In hóa đơn
  const handelInHoaDon = () => {
    console.log('Printing...');
    const options = {
      port: 9100,
      host: '192.168.1.133',
      interface: 'wifi',
    };

    console.log('giamGia: ', giamGia);
    const data = getData(
      gioVao,
      gioNghi,
      thoiGianChoi,
      tableId,
      menuItems,
      tienMenu,
      tienGio,
      giamGia,
      tienGioConLai,
      tienGioMoiPhut,
      tongTien,
    );
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

  // Chỉnh giờ
  const [modalChangeGio, setModalChangeGio] = useState(false);
  const [editedGio, setEditedGio] = useState('');
  const [editePhut, setEditedPhut] = useState('');
  const [typeGio, setTypeGio] = useState('');

  const changeGio = (gio, type_gio) => {
    setModalChangeGio(true);
    const hours = gio.split(':')[0];
    const minutes = gio.split(':')[1];
    setEditedGio(hours);
    setEditedPhut(minutes);
    setTypeGio(type_gio);
  };

  const handleSaveChangeGio = () => {
    setModalChangeGio(false);
    console.log('editedGio: ', editedGio);
    console.log('editePhut: ', editePhut);

    if (typeGio === 'GioVao') {
      // Split the string into parts
      let strGio = gioVao;
      const parts = strGio.split(/[:,]/);
      // Update the respective parts with new values
      parts[0] = editedGio;
      parts[1] = editePhut;
      parts[2] = '00';
      strGio = parts.join(':');

      if (gioNghi != 'Chưa đặt') {
        const timeClose = moment(gioNghi, 'HH:mm, DD/MM/YYYY').valueOf();
        const timeStart = moment(strGio, 'HH:mm, DD/MM/YYYY').valueOf();
        let intervalTimeCost = timeClose - timeStart;
        if (intervalTimeCost > 0) {
          intervalTimeCost = Math.round(intervalTimeCost / 1000 / 60);
          const moneyTime = Math.ceil(
            (intervalTimeCost * tienGioMoiPhut) / 1000,
          );
          const tienGioGiamGia = Math.ceil(
            moneyTime - (moneyTime * giamGia) / 100,
          );

          const totalMoney = moneyTime + tienMenu;

          firestore()
            .collection('Danh sach ban')
            .doc(title)
            .update({
              gioVao: strGio,
              tienGio: moneyTime,
              tienGioConLai: tienGioGiamGia,
              thoiGianChoi: intervalTimeCost,
              tienMenu: tienMenu,
              tongTien: totalMoney,
            })
            .then(() => {
              console.log('Updated bấm giờ nghỉ thanh toán!');
            });

          setThoiGianChoi(intervalTimeCost);
          setTienGio(moneyTime);
          setTienGioConLai(tienGioGiamGia);
          setTongTien(totalMoney);
        } else {
          Alert.alert('Giờ vào lớn hơn giờ nghỉ');
          firestore()
            .collection('Danh sach ban')
            .doc(title)
            .update({
              gioVao: strGio,
            })
            .then(() => {
              console.log('Updated bấm giờ nghỉ thanh toán!');
            });
        }
      } else {
        firestore()
          .collection('Danh sach ban')
          .doc(title)
          .update({
            gioVao: strGio,
          })
          .then(() => {
            console.log('Updated bấm giờ nghỉ thanh toán!');
          });
        // Alert.alert('Chưa bấm giờ nghỉ ');
      }
      setGioVao(strGio);
    }
    if (typeGio === 'GioNghi') {
      let strGio = gioNghi;
      const parts = strGio.split(/[:,]/);
      // Update the respective parts with new values
      parts[0] = editedGio;
      parts[1] = editePhut;
      parts[2] = '00';
      strGio = parts.join(':');
      // Tính toán lại thời gian chơi
      if (gioVao != 'Chưa đặt') {
        const timeClose = moment(strGio, 'HH:mm, DD/MM/YYYY').valueOf();
        const timeStart = moment(gioVao, 'HH:mm, DD/MM/YYYY').valueOf();
        let intervalTimeCost = timeClose - timeStart;
        if (intervalTimeCost > 0) {
          intervalTimeCost = Math.round(intervalTimeCost / 1000 / 60);
          const moneyTime = Math.ceil(
            (intervalTimeCost * tienGioMoiPhut) / 1000,
          );
          const tienGioGiamGia = Math.ceil(
            moneyTime - (moneyTime * giamGia) / 100,
          );

          const totalMoney = moneyTime + tienMenu;

          firestore()
            .collection('Danh sach ban')
            .doc(title)
            .update({
              gioNghi: strGio,
              tienGio: moneyTime,
              tienGioConLai: tienGioGiamGia,
              thoiGianChoi: intervalTimeCost,
              tienMenu: tienMenu,
              tongTien: totalMoney,
            })
            .then(() => {
              console.log('Updated thay đổi giờ nghỉ!');
            });

          setThoiGianChoi(intervalTimeCost);
          setTienGio(moneyTime);
          setTienGioConLai(tienGioGiamGia);
          setTongTien(totalMoney);
        } else {
          firestore()
            .collection('Danh sach ban')
            .doc(title)
            .update({
              gioNghi: strGio,
            })
            .then(() => {
              console.log('Giờ vào lớn hơn giờ nghỉ!');
            });
          Alert.alert('Giờ vào lớn hơn giờ nghỉ');
        }
      } else {
        firestore()
          .collection('Danh sach ban')
          .doc(title)
          .update({
            gioNghi: strGio,
          })
          .then(() => {
            console.log('Thay đổi giờ nghỉ nhưng chưa bấm giờ vào!');
          });
      }
      setGioNghi(strGio);
    }
  };

  // Chỉnh sửa giá và số lượng
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');

  const handleEdit = (item, index) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
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
    // console.log('selectedItemIndex: ', selectedItemIndex);
    // console.log('updatedItem: ', updatedItem);
    // console.log('menuItems: ', menuItems);
    const newMenuItems = [...menuItems];
    // Cập nhật phần tử trong mảng mới
    newMenuItems[selectedItemIndex] = updatedItem;

    firestore()
      .collection('Danh sach ban')
      .doc(title)
      .update({
        mon: newMenuItems,
      })
      .then(() => {
        console.log('mon updated!');
      });
    // Thực hiện các xử lý khác tại đây, ví dụ như gửi request lưu thông tin
    setSelectedItem(null);
    setModalVisible(false);
    setMenuItems(newMenuItems);
  };
  const handleXoaMon = () => {
    firestore()
      .collection('Danh sach ban')
      .doc(title)
      .update({
        mon: firestore.FieldValue.arrayRemove(selectedItem),
      })
      .then(() => {
        // Alert.alert('Đã xóa món Hãy bấm quay lại ');
      })
      .catch(error => {
        // Alert.alert('Lỗi khi xóa món ');
      });
    setSelectedItem(null);
    setModalVisible(false);
  };

  const renderItem = ({item, index}) => {
    const totalPrice = item.Gia * item.soLuong;
    return (
      <TouchableOpacity onPress={() => handleEdit(item, index)}>
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
    <KeyboardAvoidingView style={{flex: 1}} behavior="position">
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
                <Text style={styles.textTongTienThucDon}>{tienMenu} 000đ</Text>
              </View>
              {/* Giờ vào */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text style={styles.textGio}>Giờ vào: </Text>
                <Text
                  onPress={() => changeGio(gioVao, 'GioVao')}
                  style={styles.textGio}>
                  {gioVao}{' '}
                </Text>
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
                <Text
                  onPress={() => changeGio(gioNghi, 'GioNghi')}
                  style={styles.textGio}>
                  {gioNghi}{' '}
                </Text>
                <Pressable
                  onPress={handelDatGioNghi}
                  style={({pressed}) => [
                    styles.buttonDatGio,
                    {
                      backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                    },
                  ]}>
                  <Text style={styles.text_in_button}>Thanh toán</Text>
                </Pressable>
              </View>
              {/* Thơi gian chơi */}
              <View style={[styles.khu_vuc_gio]}>
                <Text style={[styles.textThoiGianChoi, {minWidth: 246}]}>
                  Thời gian chơi:{' '}
                </Text>
                <Text style={styles.textThoiGianChoi}>
                  {convertMinutesToTimeString(thoiGianChoi)}
                </Text>
              </View>
              {/*  Tiền giờ */}
              <View style={[styles.khu_vuc_gio]}>
                <Text style={[styles.textTongTien, {minWidth: 246}]}>
                  Tiền Giờ:
                </Text>
                <Text style={styles.textTongTien}>{tienGio} 000đ</Text>
              </View>
              {/* Giảm giá */}
              <View
                style={[styles.khu_vuc_gio, {justifyContent: 'space-between'}]}>
                <Text style={[styles.textThoiGianChoi, {minWidth: 100}]}>
                  Giảm giá:
                </Text>
                <TextInput
                  style={styles.textInputTienKhachDua}
                  keyboardType="numeric"
                  onChangeText={handelInputGiamGia}>
                  {giamGia}
                </TextInput>
                <Text style={[styles.textThoiGianChoi]}>%</Text>

                <Pressable
                  onPress={handleButtonGiamGia}
                  style={({pressed}) => [
                    styles.buttonDatGio,
                    {
                      backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'blue',
                    },
                  ]}>
                  <Text style={styles.text_in_button}>Giảm giá</Text>
                </Pressable>
              </View>
              {/*  Tiền giờ */}
              <View style={[styles.khu_vuc_gio, {marginBottom: 10}]}>
                <Text style={[styles.textTongTien, {minWidth: 246}]}>
                  Tiền Giờ Còn Lại :
                </Text>
                <Text style={styles.textTongTien}>{tienGioConLai} 000đ</Text>
              </View>
              {/* Tổng tiền thanh toán */}
              <Text
                style={[
                  styles.textTongTien,
                  {color: '#000', marginVertical: 4, fontSize: 20},
                ]}>
                Tổng tiền thanh toán: {tongTien} 000đ
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
                  000đ
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
                  {tienThoiLai} 000đ
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
                <View style={styles.in_hoa_don_container}>
                  <Pressable
                    onPress={handelInHoaDon}
                    style={({pressed}) => [
                      styles.buttonDatGio,
                      {
                        backgroundColor: pressed
                          ? 'rgb(210, 230, 255)'
                          : 'blue',
                      },
                    ]}>
                    <Text style={styles.text_in_button}>In hóa đơn</Text>
                  </Pressable>
                </View>
                {/* Đặt lại */}
                <View style={styles.dat_lai_container}>
                  <Pressable
                    onPress={handelReset}
                    style={({pressed}) => [
                      styles.buttonDatGio,
                      {
                        backgroundColor: pressed
                          ? 'rgb(210, 230, 255)'
                          : 'blue',
                      },
                    ]}>
                    <Text style={styles.text_in_button}>Đặt lại</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Modal thay đổi món trong danh sách */}
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={{margin: 10}}>
            <Text style={{fontSize: 20}}>{selectedItem?.TenMon}</Text>
            <View style={styles.input_modal_container}>
              <Text style={styles.text_modal}>Giá: </Text>
              <TextInput
                style={styles.input_modal}
                keyboardType="numeric"
                placeholder="Nhập giá"
                value={editedPrice}
                onChangeText={text => setEditedPrice(text)}
              />
            </View>
            <View style={styles.input_modal_container}>
              <Text style={styles.text_modal}>Số lượng: </Text>
              <TextInput
                style={styles.input_modal}
                keyboardType="numeric"
                placeholder="Nhập số lượng"
                value={editedQuantity}
                onChangeText={text => setEditedQuantity(text)}
              />
            </View>
            <TouchableOpacity style={styles.button_modal} onPress={handleSave}>
              <Text style={styles.text_button_modal}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button_modal}
              onPress={handleXoaMon}>
              <Text style={styles.text_button_modal}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button_modal} onPress={handleSave}>
              <Text style={styles.text_button_modal}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Modal thay đổi giờ trong danh sách */}
        <Modal
          visible={modalChangeGio}
          onRequestClose={() => setModalChangeGio(false)}>
          <View style={{margin: 10}}>
            <Text style={{fontSize: 20}}>Thay đổi giờ: </Text>
            <View style={styles.input_modal_container}>
              <Text style={styles.text_modal}>Giờ: </Text>
              <TextInput
                style={styles.input_modal}
                keyboardType="numeric"
                placeholder="Nhập giá"
                value={editedGio}
                onChangeText={text => setEditedGio(text)}
              />
            </View>
            <View style={styles.input_modal_container}>
              <Text style={styles.text_modal}>Phút: </Text>
              <TextInput
                style={styles.input_modal}
                keyboardType="numeric"
                placeholder="Nhập số lượng"
                value={editePhut}
                onChangeText={text => setEditedPhut(text)}
              />
            </View>
            <TouchableOpacity
              style={styles.button_modal}
              onPress={handleSaveChangeGio}>
              <Text style={styles.text_button_modal}>Lưu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button_modal}
              onPress={handleSaveChangeGio}>
              <Text style={styles.text_button_modal}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
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
  // IN hoa đơn
  in_hoa_don_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  // Button đặt lại
  dat_lai_container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  // Modal
  input_modal_container: {
    flexDirection: 'row',
    marginTop: 20,
  },
  text_modal: {marginRight: 20, width: 100},
  input_modal: {
    marginRight: 20,
    fontSize: 16,
    borderWidth: 1,
    width: 100,
    height: 40,
  },
  button_modal: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 1,
    width: 150,
    height: 50,
  },
  text_button_modal: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // commond
  text_in_button: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
  khu_vuc_gio: {
    flexDirection: 'row',
    backgroundColor: '#ccc',
    // marginBottom: 50,
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
