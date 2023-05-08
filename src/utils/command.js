import firestore from '@react-native-firebase/firestore';

export const updateBanDB = (table_id, field_data, data) => {
    firestore()
        .collection('Danh sach ban')
        .doc(table_id)
        .update({
            [field_data]: data,
        })
        .then(() => {
            console.log('Updated!', [field_data]);
        });
};

export function tinhTienMenu(data) {
    let tongTien = 0;
    for (let i = 0; i < data.length; i++) {
        tongTien += data[i].Gia * data[i].soLuong;
    }
    return tongTien;
}

export const updateMonDB = (food_id, field_data, data) => {
    firestore()
        .collection('Danh sach mon')
        .doc(food_id)
        .update({
            [field_data]: data,
        })
        .then(() => {
            console.log('Mon updated!');
        });
};

export const updateMonBanDB = (title, data) => {
    firestore()
        .collection('Danh sach ban')
        .doc(title)
        .update({
            mon: data,
        })
        .then(() => {
            console.log('Mon updated!');
        });
};
