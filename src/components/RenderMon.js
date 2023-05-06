import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

import { FlatList, Text, View } from 'react-native';

const RenderMon = ({ props }) => {
    const { tableId, title } = props;
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('Danh sach ban')
            .doc(title)
            .onSnapshot((documentSnapshot) => {
                const data_table = documentSnapshot.data();
                const list_mon_cua_ban = data_table?.mon;
                if (list_mon_cua_ban) {
                    console.log('Mon cua ban', list_mon_cua_ban);
                    setMenuItems(list_mon_cua_ban);
                }
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, [title]);

    const renderItem = ({ item }) => {
        const totalPrice = item.Gia * item.soLuong;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                <Text>{item.TenMon}</Text>
                <Text>{item.Gia}</Text>
                <Text>{item.soLuong}</Text>
                <Text>{totalPrice}</Text>
            </View>
        );
    };

    return <FlatList data={menuItems} renderItem={renderItem} keyExtractor={(item) => item.id} />;
};

export default RenderMon;
