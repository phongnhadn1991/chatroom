'use client'
import React, { useContext, useMemo, useState } from "react";
import { Send } from "lucide-react"
import AuthContext from "@/context/authProvider";
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import AppContext from "@/context/appProvider";
import HeadingRoom from "@/components/header/headingRoom";
import MembersRoom from "@/components/header/membersRoom";
import ChatRoom from "@/components/rooms/chatRoom";
import TopSidebar from "@/components/sidebar/topSidebar";
import ListRoom from "@/components/rooms/listRoom";

const Home = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [chatItems, setChatItems] = useState([
    {
      id: 1,
      username: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastMessage: "Hey, how are you doing?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      username: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastMessage: "Can we schedule a meeting for tomorrow?",
      timestamp: "Yesterday",
    },
    {
      id: 3,
      username: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastMessage: "The project is coming along nicely!",
      timestamp: "2 days ago",
    },
  ]);
  const { user } = useContext(AuthContext)
  const { rooms, selectedRoom, setSelectedRoom, roomMembers } = useContext(AppContext)

  const groupedRooms = useMemo(() => {
    const groups = {};

    rooms.forEach(room => {
      const date = new Date(room.createdAt.seconds * 1000);
      let groupKey;

      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else {
        const daysAgo = differenceInDays(new Date(), date);
        groupKey = `${daysAgo} days ago`;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(room);
    });

    return Object.entries(groups).sort((a, b) => {
      const order = ['Today', 'Yesterday'];
      const indexA = order.indexOf(a[0]);
      const indexB = order.indexOf(b[0]);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return b[1][0].createdAt.seconds - a[1][0].createdAt.seconds;
    });
  }, [rooms]);

  const handleRoomSelected = (roomId) => {
    setSelectedRoom((prevState) => ({ ...prevState, roomId: roomId }));
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setError("");
  };

  const handleSendMessage = () => {
    if (message.trim() === "") {
      setError("Message cannot be empty");
    } else {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Left Column */}
      <div className="w-full lg:w-[350px] bg-white shadow-lg p-6 flex flex-col">
        <TopSidebar user={user} />
        <ListRoom
          selectedRoom={selectedRoom}
          groupedRooms={groupedRooms}
          handleRoomSelected={handleRoomSelected}
        />
      </div>

      {/* Right Column */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <HeadingRoom selectedRoomInfo={selectedRoom.roomInfo} />
          <MembersRoom roomMembers={roomMembers} />
        </div>

        <div className="flex flex-1 bg-white p-4 rounded-md border border-gray-300">
          <ChatRoom chatItems={chatItems} />
        </div>

        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type your message here..."
              className={`w-full p-3 pr-12 rounded-md border ${error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-300`}
              aria-label="Message input"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 focus:outline-none"
              aria-label="Send message"
            >
              <Send strokeWidth={1.5} absoluteStrokeWidth />
            </button>
          </div>
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;