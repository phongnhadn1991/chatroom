const HeadingRoom = ({ selectedRoomInfo }) => {
    return (
        <div>
            <h2 className="text-xl font-bold">
                {selectedRoomInfo.status
                    ? selectedRoomInfo.name
                    : "Room chat"}
            </h2>
            <p className="text-gray-600 text-sm">
                {selectedRoomInfo.status
                    ? selectedRoomInfo.description
                    : "Choose a room to start chatting"}
            </p>
        </div>
    );
}

export default HeadingRoom;
