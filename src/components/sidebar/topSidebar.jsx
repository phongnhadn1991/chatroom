import React, { Fragment } from 'react';
import getCharAt from "@/mixins/getCharAt";
import { Button } from "@/components/ui/button"
import { Lock, LogOut } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator";
import { auth } from '@/firebase/config';

const TopSidebar = ({ user }) => {
    return (
        <Fragment>
            <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative inline-flex items-center justify-center w-10 h-10 min-w-10 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                        {user.photoURL ? <img src={user.photoURL} alt="" /> : <span className="font-bold text-xl text-gray-600 dark:text-gray-500">{user.displayName ? getCharAt(user.displayName) : getCharAt(user.email)}</span>}
                    </div>
                    <h2 className="text-sm font-semibold line-clamp-1">{user.displayName ? user.displayName : user.email}</h2>
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
        </Fragment>
    );
}

export default TopSidebar;
