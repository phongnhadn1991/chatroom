import { db } from '@/firebase/config';  // Chỉ cần import db
import { addDoc, collection, getDocs, doc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

export const addDocument = async (collectionName, data) => {
    try {
        if (!collectionName) {
            throw new Error("Collection name cannot be empty");
        }

        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

export const getProfileByUid = async (collectionName, uid) => {
    const docRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
}

export const getRooms = (collectionName, callback) => {
    if (!collectionName) {
        throw new Error("Collection name must be provided");
    }

    const roomsCollection = collection(db, collectionName);

    const unsubscribe = onSnapshot(
        roomsCollection,
        (snapshot) => {
            const roomsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(`roomsList db ${collectionName}: `, roomsList);
            callback(roomsList);  // Trả dữ liệu về thông qua callback
        },
        (error) => {
            console.error("Error getting rooms: ", error);
        }
    );

    return unsubscribe;
}