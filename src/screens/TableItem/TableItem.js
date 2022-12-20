import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    FlatList,
    Alert,
    Pressable,
} from 'react-native';
import * as React from 'react';

export default function TableItem({ route, navigation }) {
    const onPressXoaMon = (id) => {
        // Alert.alert('Xoa');
        // Xem index xoá là item nào trong menuItemList rồi xóa bằng splice(index, 1)
        setMenuItemList((menuItemList) => {
            console.log('index Xoa trong ham', id);
            const newMenuItemList = [...menuItemList];
            console.log('newMenuItemList truoc khi xoa', newMenuItemList);
            newMenuItemList.splice(id, 1);
            console.log('newMenuItemList sau khi xoa', newMenuItemList);

            return newMenuItemList;
        });
    };

    const RenderMon = ({ props }) => {
        const { id, showText } = props;
        console.log('props: ', props);
        const [text, setText] = React.useState('');
        const [price, setPrice] = React.useState('');
        const [quanity, setQuantity] = React.useState('');
        const [sumMoney, setSumMoney] = React.useState(price);
        return (
            <View style={styles.container}>
                <View>
                    <Text style={{ display: showText }}>Mon</Text>
                    <TextInput
                        style={[styles.textInput, styles.textInputMenu]}
                        placeholder="Nhập..."
                        defaultValue={text}
                        autoFocus={true}
                        onChangeText={(newText) => {
                            setText(newText);
                        }}
                    />
                </View>
                <View>
                    <Text style={{ display: showText }}>Giá</Text>
                    <TextInput
                        style={[styles.textInput, styles.textInputPrice]}
                        placeholder="Nhập..."
                        keyboardType="numeric"
                        value={price}
                        // blurOnSubmit={false}
                        autoFocus={false}
                        // onSubmitEditing={() => price.focus()}
                        onChange={(newPrice) => {
                            setPrice(newPrice);
                        }}
                    >
                        {/* <Text style={{ alignSelf: 'flex-end' }}>K</Text> */}
                    </TextInput>
                </View>
                <View>
                    <Text style={{ display: showText }}>Số lượng</Text>
                    <TextInput
                        style={[styles.textInput, styles.textInputQuantity]}
                        placeholder="Nhập..."
                        keyboardType="numeric"
                        value={quanity}
                        onChangeText={(newQuantity) => {
                            setQuantity(newQuantity);
                        }}
                    />
                </View>
                <View>
                    <Text style={{ display: showText }}>Thành tiền</Text>
                    <TextInput
                        style={[styles.textInput, styles.textInputQuantity]}
                        placeholder="0"
                        keyboardType="numeric"
                        value={sumMoney}
                        onChangeText={(newQuantity) => {
                            setSumMoney(newQuantity);
                        }}
                    />
                </View>

                {/* Button Xóa món */}
                <Pressable
                    onPress={() => {
                        console.log('index Xoa', id);
                        onPressXoaMon(id);
                    }}
                    style={({ pressed }) => [
                        styles.buttonXoa,
                        {
                            backgroundColor: pressed ? 'blue' : 'red',
                        },
                    ]}
                >
                    <Text style={{ textAlign: 'center', fontSize: '16' }}>
                        Xóa
                    </Text>
                </Pressable>
            </View>
        );
    };
    console.log('re-render');
    const [menuItemList, setMenuItemList] = React.useState([
        <RenderMon props={{ showText: 'flex', id: 0 }} />,
    ]);

    // Update lại title khi click vào từng bàn
    const { itemId, title } = route.params;
    React.useEffect(() => {
        if (route.params?.title) {
            navigation.setOptions({ title: title });
        }
    }, [route.params?.title]);

    // Button thêm món sẽ add thêm một RenderMon vào mảng
    React.useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={() =>
                        setMenuItemList((menuItemList) => {
                            const newMenuItemList = [...menuItemList];
                            newMenuItemList.push(
                                <RenderMon
                                    props={{
                                        showText: 'none',
                                        id: newMenuItemList.length,
                                    }}
                                />,
                            );
                            return newMenuItemList;
                        })
                    }
                    style={{
                        backgroundColor: 'blue',
                        padding: 8,
                        borderRadius: '5%',
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: 'yellow',
                        }}
                    >
                        Thêm
                    </Text>
                </Pressable>
            ),
        });
    }, [navigation]);
    console.log('menuItemList', menuItemList);
    return (
        <View>
            <FlatList
                data={menuItemList}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => {
                    return item;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    textInput: {
        backgroundColor: '#ccc',
        marginRight: 4,
        fontSize: 18,
        paddingVertical: 8,
        borderWidth: 1,
    },
    textInputMenu: {
        minWidth: 100,
    },
    textInputPrice: {
        minWidth: 70,
    },
    textInputQuantity: {
        minWidth: 50,
    },
    buttonXoa: {
        // height: 20,
        width: 70,
        paddingVertical: 8,
        backgroundColor: 'blue',
        borderRadius: '10%',
    },
});
