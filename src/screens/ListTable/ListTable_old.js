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
function TableComponent(props) {
  const {table, onPress} = props;
  // console.log('props: ', props);
  // let curTime = new Date().toLocaleString();
  let d = new Date();
  let day = d.getDay();

  // console.log(curTime);
  const [currentTime, setcurentTime] = React.useState();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setcurentTime(new Date().toLocaleString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={onPress}
      style={{
        // heighpadpadt: 100,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: '#8af0b2',
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        // shawdow for android
        elevation: 5,
        marginBottom: 16,
      }}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            textTransform: 'uppercase',
            marginBottom: 8,
            fontWeight: '600',
            fontSize: 24,
            marginTop: 20,
            // textAlign: 'center',
            // textAlignVertical: 'center',
          }}>
          {table.name}
        </Text>
        <Text
          style={{
            textTransform: 'uppercase',
            marginBottom: 8,
            fontWeight: '600',
            textAlign: 'center',
            textAlignVertical: 'center',
            color: 'green',
          }}>
          {convertDay[String(day)]} {currentTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ListTable({navigation}) {
  // removeValueOfKey(KEY_TABLE_ITEM);

  const state = {
    categories: [
      {id: 1, name: 'Bàn 1', loai: 'Bida lib'},
      {id: 2, name: 'Bàn 2', loai: 'Bida lib'},
      {id: 3, name: 'Bàn 3', loai: 'Bida lib'},
      {id: 4, name: 'Bàn 4', loai: 'Bida 3C'},
      {id: 5, name: 'Bàn 5', loai: 'Bida 3C'},
      {id: 6, name: 'Bàn 6', loai: 'Bida lỗ'},
      {id: 7, name: 'Bàn 7', loai: 'Bida lib'},
      {id: 8, name: 'Bàn 8', loai: 'Bida lỗ'},
    ],
  };

  const categories = state.categories;

  const handlePress = () => {
    console.log('Button pressed!');
    navigation.navigate('TaoMon');
  };

  return (
    <View style={styles.container}>
      <View style={styles.danhsachban}>
        <></>
      </View>
      <FlatList
        data={categories}
        // horizontal={false}
        numColumns={2}
        renderItem={({item}) => {
          return (
            <TableComponent
              style={styles.table_item}
              table={item}
              onPress={() => {
                navigation.navigate('TableItem', {
                  tableId: item.id,
                  title: item.name,
                });
              }}
            />
          );
        }}
        keyExtractor={item => `${item.id}`}
        contentContainerStyle={{paddingLeft: 8, paddingRight: 0}}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
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
    alignItems: 'center',
    justifyContent: 'center',
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
