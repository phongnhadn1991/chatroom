import React, { Fragment, useContext, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus2, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useFireStore from '@/hooks/use-firestore';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import AppContext from '@/context/appProvider';
import { db } from '@/firebase/config';
import { doc, updateDoc } from "firebase/firestore";
const InviteRoom = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [openAddRoom, setOpenAddRoom] = useState(false);
    const [uidMemberInvite, setUidMemberInvite] = useState("")
    const { selectedRoom } = useContext(AppContext)
    const listAllUser = useFireStore('users')

    const conditionRoomMembers = useMemo(() => {
        if (!selectedRoom.roomInfo?.members || !listAllUser?.length) {
            return null;
        }

        const filteredMembers = listAllUser.filter(item =>
            !selectedRoom.roomInfo.members.includes(item.uid)
        );

        if (filteredMembers.length === 0) {
            return null;
        }

        return filteredMembers.length > 0 ? {
            fieldName: 'uid',
            operator: 'in',
            value: filteredMembers.map(member => member.uid),
        } : null;
    }, [selectedRoom.roomInfo?.members, listAllUser]);

    const listMembers = useFireStore('users', conditionRoomMembers);

    const handleInviteMember = async (newMemberUid) => {
        if (!selectedRoom.roomId || !newMemberUid) return null;

        try {
            const roomRef = doc(db, 'rooms', selectedRoom.roomId);
            await updateDoc(roomRef, {
                members: [...selectedRoom.roomInfo.members, newMemberUid]
            });
            return true;
        } catch (error) {
            console.error('Error inviting member:', error);
            return null;
        }
    };

    const handleInviteSubmit = async () => {
        if (!uidMemberInvite) return;

        setIsLoading(true);
        try {
            const success = await handleInviteMember(uidMemberInvite);
            if (success) {
                setUidMemberInvite('');
                setOpenAddRoom(false);
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Fragment>
            <Dialog open={openAddRoom} onOpenChange={setOpenAddRoom}>
                <DialogTrigger asChild>
                    <Button className="gap-2 shadow-sm">
                        <UserPlus2 strokeWidth={1} size={16} absoluteStrokeWidth /> Invite
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full">
                    <DialogHeader>
                        <DialogTitle>Invite member</DialogTitle>
                        <DialogDescription>
                            input email member
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {listMembers && listMembers.length > 0 &&
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {uidMemberInvite && uidMemberInvite !== ''
                                            ? listMembers.find((member) => member.uid === uidMemberInvite)?.email
                                            : 'Invite member'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[500px] max-w-[462px] p-0">
                                    <Command multiple>
                                        <CommandInput placeholder="Search member..." />
                                        <CommandList>
                                            <CommandEmpty>No member found.</CommandEmpty>
                                            <CommandGroup multiple>
                                                {listMembers.length > 0 && listMembers.length !== selectedRoom?.roomInfo?.members.length && listMembers.map((member) => (
                                                    <CommandItem
                                                        key={member.id}
                                                        value={member.uid}
                                                        onSelect={(currentMemberUid) => {
                                                            setUidMemberInvite(currentMemberUid === uidMemberInvite ? "" : currentMemberUid)
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                uidMemberInvite === member.uid ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <Avatar className="mr-2 w-7 h-7">
                                                            {member.photoURL && <AvatarImage src={member.photoURL} alt="@shadcn" />}
                                                            <AvatarFallback className="bg-gray-200">{member.displayName ? member.displayName.charAt(0) : member.email.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        {member.displayName ? member.displayName : ''} {!member.displayName ? member.email : `(${member.email})`}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        }
                    </div>
                    <DialogFooter>
                        <Button onClick={handleInviteSubmit} disabled={isLoading} type="submit">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Invite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Fragment >
    );
}

export default InviteRoom;
