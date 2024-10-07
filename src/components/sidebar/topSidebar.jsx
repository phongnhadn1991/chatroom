import React, { Fragment, useState } from 'react';
import getCharAt from "@/mixins/getCharAt";
import { Button } from "@/components/ui/button"
import { Lock, LogOut, ListPlus, Loader2 } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from '@/firebase/config';
import { useForm } from 'react-hook-form';
import { addDocument } from '@/firebase/service';

const TopSidebar = ({ user }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [openAddRoom, setopenAddRoom] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true)
        const roomObject = {
            name: data.nameRoom,
            description: data.descriptionRoom,
            members: [user.uid]
        }
        await addDocument('rooms', roomObject)
        reset()
        setIsLoading(false)
        setopenAddRoom(false)
    };

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
            <div className='flex justify-end gap-2 mb-2'>
                <Dialog open={openAddRoom} onOpenChange={setopenAddRoom}>
                    <DialogTrigger asChild>
                        <Button className="inline-flex" variant="outline">
                            <ListPlus className="color-gray-700 mr-2" />
                            <span className='text-md'>Add room</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Add New Room</DialogTitle>
                                <DialogDescription>
                                    Add Room to create and manage new chat rooms easily.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nameRoom" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="nameRoom"
                                        name="nameRoom"
                                        className="col-span-3"
                                        {...register('nameRoom', { required: true })}
                                    />
                                </div>
                                {errors.nameRoom &&
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <span className='col-span-3 col-start-2 text-xs text-red-500'>This field is required</span>
                                    </div>
                                }
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="descriptionRoom" className="text-right">
                                        Description
                                    </Label>
                                    <Input
                                        id="descriptionRoom"
                                        name="descriptionRoom"
                                        className="col-span-3"
                                        {...register('descriptionRoom', { required: true })}
                                    />
                                </div>
                                {errors.descriptionRoom &&
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <span className='col-span-3 col-start-2 text-xs text-red-500'>This field is required</span>
                                    </div>
                                }
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button disabled={isLoading} type="submit">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add room</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>

                </Dialog>
            </div>
        </Fragment >
    );
}

export default TopSidebar;
