import firebase, { db } from './config';

export const addDocument = (collection, data) => {
    console.log('collection: ', collection);
    console.log('data: ', data);
    const query = db.collection(collection);

    query.add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const addDocumentV2 = (collectionName, data) => {
    db.collection(collectionName).add(data);
};

// thuật toán search full text không dùng thư viện bên thứ ba.
// search: 'Tun' của displayName
// Ta sẽ tách displayName từng từ vào một trường khác tên là keywords như sau
/**
 * db: collection users
 * {
 * displayName: 'Tung Nguyen David' => sinh ra các hoán vị có thể có của array này ['Tung', 'Nguyen', 'David'] => [Nguyen, Tung, David], ...
 * keywords: ['T', 'Tu', 'Tun', 'Tung', 'Tung ', 'Tung N', ...'N', 'Ng', ...] lấy tất cả hoán vị của displayName trước rồi tách sau
 * ...
 * }
 */
// Sau đó dùng array contain của keywords để tìm kiếm displayName phù hợp

// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const name = displayName.split(' ').filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name) => {
        const arrName = [];
        let curName = '';
        name.split('').forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k) {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(' '));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;
};
