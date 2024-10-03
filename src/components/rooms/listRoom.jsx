import { format } from 'date-fns';

const ListRoom = ({ selectedRoom, groupedRooms, handleRoomSelected }) => {

    return (
        <div className="flex flex-col gap-8">
            <div>
                {groupedRooms.map(([groupName, groupRooms]) => (
                    <div key={groupName}>
                        <h3 className="text-xs text-gray-500 font-semibold mb-4">{groupName}</h3>
                        <ul className="space-y-2 mb-6">
                            {groupRooms.map((room) => (
                                <li key={room.id}>
                                    <div
                                        className={`flex justify-between align-center w-full text-left text-sm p-3 rounded-md transition-colors duration-200 cursor-pointer ${selectedRoom.roomId === room.id
                                            ? "bg-gray-300 cursor-not-allowed pointer-events-none"
                                            : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => handleRoomSelected(room.id)}
                                    >
                                        <span className='line-clamp-1'>
                                            {room.name}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-4">
                                            {format(new Date(room.createdAt.seconds * 1000), 'HH:mm')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListRoom;
