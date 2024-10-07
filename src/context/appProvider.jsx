"use client"
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useFireStore from '@/hooks/use-firestore';
import AuthContext from './authProvider';
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [selectedRoom, setSelectedRoom] = useState({
        status: false,
        roomId: '',
        roomInfo: {
            members: []
        }
    });

    const conditionRoom = useMemo(() => {
        return { fieldName: 'members', operator: 'array-contains', value: user.uid };
    }, [user.uid])
    const rooms = useFireStore('rooms', conditionRoom);

    const resultSelectedRoom = useMemo(() => {
        return rooms.find(room => room.id === selectedRoom.roomId)
    }, [rooms, selectedRoom.roomId])

    useEffect(() => {
        if (resultSelectedRoom) {
            setSelectedRoom(prevState => ({
                ...prevState,
                status: true,
                roomInfo: resultSelectedRoom
            }));
        }
    }, [resultSelectedRoom]);

    const conditionRoomMembers = useMemo(() => {
        if (selectedRoom.roomInfo && selectedRoom.roomInfo.members?.length > 0) {
            return {
                fieldName: 'uid',
                operator: 'in',
                value: selectedRoom?.roomInfo?.members || []
            };
        }
        return null;
    }, [selectedRoom.roomInfo?.id, selectedRoom.roomInfo?.members]);
    const roomMembers = useFireStore('users', conditionRoomMembers);

    return (
        <AppContext.Provider value={{ rooms, selectedRoom, setSelectedRoom, roomMembers }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;