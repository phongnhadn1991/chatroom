'use client'
import React, { useContext, useMemo, useState } from "react";
import { Clock, Lock, LogOut, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator";
import { auth } from '@/firebase/config';
import AuthContext from "@/context/authProvider";
import { useRouter } from 'next-nprogress-bar';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import useFireStore from "@/hooks/use-firestore";
import AppContext from "@/context/appProvider";
import HeadingRoom from "@/components/header/headingRoom";
import MembersRoom from "@/components/header/membersRoom";

const Home = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()
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
  const { displayName, photoURL, email } = user || {};
  const { rooms, selectedRoom, setSelectedRoom } = useContext(AppContext)

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

  const getCharAtUser = (data) => data !== undefined ? data.charAt(0).toUpperCase() : '';

  const handleRoomSelected = (roomId) => {
    setSelectedRoom((prevState) => ({ ...prevState, roomId: roomId }));
  };

  const conditionRoomMembers = useMemo(() => {
    if (selectedRoom.roomInfo && selectedRoom.roomInfo.members?.length > 0) {
      return { fieldName: 'uid', operator: 'in', value: selectedRoom.roomInfo.members };
    }
  }, [selectedRoom.roomInfo?.id]);
  const roomMembers = useFireStore('users', conditionRoomMembers);

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
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center justify-center w-10 h-10 min-w-10 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
              {photoURL ? <img src={photoURL} alt="" /> : <span className="font-bold text-xl text-gray-600 dark:text-gray-500">{displayName ? getCharAtUser(displayName) : getCharAtUser(email)}</span>}
            </div>
            <h2 className="text-sm font-semibold line-clamp-1">{displayName ? displayName : email}</h2>
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {(user && Object.keys(user).length > 0)
                    ?
                    <Button size="icon" className="bg-red-500 hover:bg-red-700" onClick={async () => await auth.signOut()}>
                      <LogOut strokeWidth={1.5} absoluteStrokeWidth className="h-4 w-4" />
                    </Button>
                    :
                    <Button size="icon" className="bg-blue-500 hover:bg-blue-700" onClick={() => router.push('/login')}>
                      <Lock strokeWidth={1.5} absoluteStrokeWidth className="h-4 w-4" />
                    </Button>
                  }
                </TooltipTrigger>
                <TooltipContent>
                  {(user && Object.keys(user).length > 0) ? <p>Logout</p> : <p>Login</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-8">
          <div>
            {groupedRooms.map(([groupName, groupRooms]) => (
              <div key={groupName}>
                <h3 className="text-xs text-gray-500 font-semibold mb-4">{groupName}</h3>
                <ul className="space-y-2 mb-6">
                  {groupRooms.map((room) => (
                    <li key={room.id}>
                      <div
                        className={`w-full text-left text-sm p-3 rounded-md transition-colors duration-200 cursor-pointer ${selectedRoom.roomId === room.id
                          ? "bg-gray-300 cursor-not-allowed pointer-events-none"
                          : "hover:bg-gray-100"
                          }`}
                        onClick={() => handleRoomSelected(room.id)}
                      >
                        {room.name}
                        <span className="text-xs text-gray-500 ml-2">
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
      </div>

      {/* Right Column */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <HeadingRoom selectedRoomInfo={selectedRoom.roomInfo} />
          <MembersRoom roomMembers={roomMembers} />
        </div>

        <div className="flex flex-1 bg-white p-4 rounded-md border border-gray-300">
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