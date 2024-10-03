"use client"
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useFireStore from '@/hooks/use-firestore';
import AuthContext from './authProvider';
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [selectedRoom, setSelectedRoom] = useState({
        roomId: '',
        roomInfo: ''
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
                roomInfo: resultSelectedRoom
            }));
        }
    }, [resultSelectedRoom]);

    return (
        <AppContext.Provider value={{ rooms, selectedRoom, setSelectedRoom }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;