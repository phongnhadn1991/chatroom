import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { UserPlus2 } from "lucide-react"
import getCharAt from "@/mixins/getCharAt";

const MembersRoom = ({ roomMembers }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
                {roomMembers.slice(0, 5).map(member => {
                    return member.photoURL
                        ?
                        <img key={member.uid} className="inline-block size-[32px] rounded-full ring-2 ring-white dark:ring-neutral-900" src={member.photoURL} alt="Avatar" />
                        :
                        <div key={member.uid} className="inline-flex items-center justify-center bg-gray-200 size-[32px] rounded-full ring-2 ring-white dark:ring-neutral-900">
                            <span className="font-normal text-md text-gray-600 dark:text-gray-500">{member.displayName ? getCharAt(member.displayName) : getCharAt(member.email)}</span>
                        </div>
                }
                )}
                {roomMembers.length > 5 && (
                    <div className="[--placement:top-left] relative inline-flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <div className="inline-flex items-center justify-center size-[32px] rounded-full bg-gray-100 border-2 border-white font-medium text-gray-700 shadow-sm align-middle hover:bg-gray-200 focus:outline-none focus:bg-gray-300 text-sm dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:border-neutral-800">
                                    <span className="font-medium leading-none">{roomMembers.length - 5}+</span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {roomMembers.slice(5).map(member =>
                                    <DropdownMenuItem key={member.uid}>
                                        <span className="flex text-xs text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300" href="#">
                                            {member.displayName}
                                        </span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

            </div>
            <Button className="gap-2 shadow-sm">
                <UserPlus2 strokeWidth={1} size={16} absoluteStrokeWidth /> Invite
            </Button>
        </div>
    );
}

export default MembersRoom;
