import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { removeValueOfKey } from '../../utils';
import { KEY_TABLE_ITEM } from '../../utils';

function TableComponent(props) {
    const { table, onPress } = props;
    // console.log('props: ', props);
    let curTime = new Date().toLocaleString();
    // let curTime = new Date();
    // console.log(curTime);

    return (
        <TouchableOpacity activeOpacity={0.3} onPress={onPress}>
            <View style={styles.tableComponent}>
                <Text style={styles.title}>{table.name}</Text>
                <Text>{curTime}</Text>
                {/* <Image style={{height: 64, width:64}} source={image1}></Image> */}
                {/* <Image style={styles.categoryImage} source={image1}></Image> */}
            </View>
        </TouchableOpacity>
    );
}

export default function ListTable({ navigation }) {
    removeValueOfKey(KEY_TABLE_ITEM);

    const state = {
        categories: [
            { id: 1, name: 'Bàn 1' },
            { id: 2, name: 'Bàn 2' },
            { id: 3, name: 'Bàn 3' },
            { id: 4, name: 'Bàn 4' },
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
    tableComponent: {
        // alignItems: 'flex-end',
        padding: 48,
        borderRadius: 4,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        marginBottom: 16,
    },
    title: {
        textTransform: 'uppercase',
        marginBottom: 8,
        fontWeight: '600',
    },
});
