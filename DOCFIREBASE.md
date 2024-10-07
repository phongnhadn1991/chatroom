const handleInviteMember = async (newMemberUid) => {
    try {
        const roomRef = doc(db, 'rooms', selectedRoom.roomId); // Tham chiếu đến document cụ thể
        const docSnap = await getDoc(roomRef); // Lấy dữ liệu từ document

        if (docSnap.exists()) {
            // Kiểm tra xem document có tồn tại không
            console.log('Document data:', docSnap.data());
            return docSnap.data(); // Trả về dữ liệu document
        } else {
            console.log('No such document!'); // Nếu không tồn tại
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error); // Xử lý lỗi
        return null; // Trả về null nếu có lỗi
    }
};

const someFunction = async () => {
    const roomData = await handleInviteMember();
    if (roomData) {
        // Thực hiện hành động với dữ liệu room
        console.log('Room Data:', roomData);
    }
};