import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function TaoMon() {
    const [tenMon, setTenMon] = useState('');
    const [gia, setGia] = useState('');
    const [loai, setLoai] = useState('');

    const handleSubmit = () => {
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
            .catch((error) => console.error('Có lỗi khi thêm món: ', error));

        console.log('Đã thêm món thành công!');

        setTenMon('');
        setGia('');
        setLoai('');
    };

    return (
        <View style={styles.container}>
            <Text>Thêm món ăn hoặc đồ uống: </Text>
            <TextInput placeholder="Tên món" value={tenMon} onChangeText={(text) => setTenMon(text)} />
            <TextInput placeholder="Giá" value={gia} onChangeText={(text) => setGia(text)} />
            <TextInput placeholder="Loại" value={loai} onChangeText={(text) => setLoai(text)} />
            <Button title="Thêm" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // flexDirection: 'row',
        // backgroundColor: '#ccc',
    },
});
