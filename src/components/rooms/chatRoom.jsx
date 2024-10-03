import { Clock } from "lucide-react"

const ChatRoom = ({ chatItems }) => {
    return (
        <div className="flex flex-1">
            <ul className="flex overflow-y-auto flex-1 flex-col justify-end">
                {chatItems.map((item) => (
                    <li
                        key={item.id}
                        className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                        <div className="flex items-center space-x-4" tabIndex="0" aria-label={`Chat with ${item.username}`}>
                            <div className="flex-shrink-0">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={item.avatar}
                                    alt={`${item.username}'s avatar`}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.username}</p>
                                <p className="text-sm text-gray-500 truncate">{item.lastMessage}</p>
                            </div>
                            <div className="flex-shrink-0 text-xs text-gray-400">
                                <Clock strokeWidth={1.5} size={16} absoluteStrokeWidth className="inline-block mr-1" />
                                <span>{item.timestamp}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatRoom;
