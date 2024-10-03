import { useEffect, useState } from "react";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

const useFireStore = (collectionName, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        let collectionRef = collection(db, collectionName);

        // Xây dựng query với điều kiện sắp xếp và lọc
        let q = query(collectionRef, orderBy('createdAt')); // Sắp xếp theo 'createdAt'

        // Kiểm tra điều kiện
        if (condition && condition.fieldName && condition.operator && condition.value !== undefined) {
            q = query(q, where(condition.fieldName, condition.operator, condition.value));
        }

        // Lắng nghe sự thay đổi dữ liệu
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDocuments(documents);
        });

        // Hủy đăng ký snapshot khi component unmount
        return () => {
            unsubscribe();
        };
    }, [collectionName, condition]);

    return documents;
}

export default useFireStore;