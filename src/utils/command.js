import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

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

export async function readFieldDataDB(collection, document, field_data) {
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

export function convertMinutesToTimeString(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursString = hours < 10 ? `${hours}` : `${hours}`;
  const minutesString =
    remainingMinutes < 10 ? `${remainingMinutes}` : `${remainingMinutes}`;
  return `${hoursString}h ${minutesString}phut`;
}
