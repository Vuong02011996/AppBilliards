import { StyleSheet, Text, View, Pressable, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { removeValueOfKey } from '../../utils';
import { KEY_TABLE_ITEM } from '../../utils';

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
    const { table, onPress } = props;
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
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                // shawdow for android
                elevation: 5,
                marginBottom: 16,
            }}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text
                    style={{
                        textTransform: 'uppercase',
                        marginBottom: 8,
                        fontWeight: '600',
                        fontSize: 24,
                        marginTop: 20,
                        // textAlign: 'center',
                        // textAlignVertical: 'center',
                    }}
                >
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
                    }}
                >
                    {convertDay[String(day)]} {currentTime}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function ListTable({ navigation }) {
    // removeValueOfKey(KEY_TABLE_ITEM);

    const state = {
        categories: [
            { id: 1, name: 'Bàn 1' },
            { id: 2, name: 'Bàn 2' },
            { id: 3, name: 'Bàn 3' },
            { id: 4, name: 'Bàn 4' },
            { id: 5, name: 'Bàn 5' },
        ],
    };

    const categories = state.categories;

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                renderItem={({ item }) => {
                    return (
                        <TableComponent
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
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={{ paddingLeft: 32, paddingRight: 32 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});
