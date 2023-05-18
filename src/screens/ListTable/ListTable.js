/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const convertDay = {
  1: 'Thứ hai',
  2: 'Thứ ba',
  3: 'Thứ tư',
  4: 'Thứ năm',
  5: 'Thứ sáu',
  6: 'Thứ bảy',
  7: 'Chủ Nhật',
};

export default function ListTable({navigation}) {
  // removeValueOfKey(KEY_TABLE_ITEM);

  const state = {
    categories: [
      {
        id: 1,
        name: 'Bàn 1',
        loai: 'Bida lib',
        backgroundColor: '#8af0b2',
        price: 600,
      },
      {
        id: 2,
        name: 'Bàn 2',
        loai: 'Bida lib',
        backgroundColor: '#8af0b2',
        price: 600,
      },
      {
        id: 3,
        name: 'Bàn 3',
        loai: 'Bida lib',
        backgroundColor: '#8af0b2',
        price: 600,
      },
      {
        id: 4,
        name: 'Bàn 4',
        loai: 'Bida 3C',
        backgroundColor: 'green',
        price: 750,
      },
      {
        id: 5,
        name: 'Bàn 5',
        loai: 'Bida 3C',
        backgroundColor: 'green',
        price: 750,
      },
      {
        id: 6,
        name: 'Bàn 6',
        loai: 'Bida lỗ',
        backgroundColor: 'yellow',
        price: 600,
      },
      {
        id: 7,
        name: 'Bàn 7',
        loai: 'Bida lib',
        backgroundColor: '#8af0b2',
        price: 600,
      },
      {
        id: 8,
        name: 'Bàn 8',
        loai: 'Bida lib',
        backgroundColor: '#8af0b2',
        price: 600,
      },
    ],
  };

  const categories = state.categories;

  const handlePressTaoMon = () => {
    console.log('Button pressed!');
    navigation.navigate('TaoMon');
  };

  const pressTableItem = (tableId, title, price) => {
    navigation.navigate('TableItem', {
      tableId: tableId,
      title: title,
      price: price,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.danhsachban}>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[0].id,
              categories[0].name,
              categories[0].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_left,
            {backgroundColor: categories[0].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[0].name}</Text>
            <Text style={styles.text_content_loai}>{categories[0].loai}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[5].id,
              categories[5].name,
              categories[5].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_right,
            {backgroundColor: categories[5].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[5].name}</Text>
            <Text style={styles.text_content_loai}>{categories[5].loai}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[1].id,
              categories[1].name,
              categories[1].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_left,
            {backgroundColor: categories[1].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[1].name}</Text>
            <Text style={styles.text_content_loai}>{categories[1].loai}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[6].id,
              categories[6].name,
              categories[6].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_right,
            {backgroundColor: categories[6].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[6].name}</Text>
            <Text style={styles.text_content_loai}>{categories[6].loai}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[2].id,
              categories[2].name,
              categories[2].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_left,
            {backgroundColor: categories[2].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[2].name}</Text>
            <Text style={styles.text_content_loai}>{categories[2].loai}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[7].id,
              categories[7].name,
              categories[7].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_right,
            {backgroundColor: categories[7].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[7].name}</Text>
            <Text style={styles.text_content_loai}>{categories[7].loai}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[3].id,
              categories[3].name,
              categories[3].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_left,
            {backgroundColor: categories[3].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[3].name}</Text>
            <Text style={styles.text_content_loai}>{categories[3].loai}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            pressTableItem(
              categories[4].id,
              categories[4].name,
              categories[4].price,
            )
          }
          style={[
            styles.table_item,
            styles.table_left,
            {backgroundColor: categories[4].backgroundColor},
          ]}>
          <View style={styles.text_table}>
            <Text style={styles.text_content}>{categories[4].name}</Text>
            <Text style={styles.text_content_loai}>{categories[4].loai}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handlePressTaoMon}>
          <Text style={styles.buttonText}>Tạo món</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'flex-start',
  },
  danhsachban: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    margin: 16,
  },
  table_item: {
    width: 180,
    height: 60,
    borderRadius: 4,
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // shawdow for android
    elevation: 5,
    marginBottom: 8,
  },
  table_right: {
    // alignSelf: 'flex-end',
    // alignContent: 'flex-end',
    width: 100,
    height: 80,
    marginLeft: 20,
  },
  table_left: {
    marginBottom: 20,
  },

  // Text in table
  text_table: {alignItems: 'center', justifyContent: 'center'},
  text_content: {
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 18,
  },
  text_content_loai: {
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
