'use client'

import { Doc } from "@/convex/_generated/dataModel";
import { useCreateNewChat } from "@/hooks/useCreateNewChat";
import { useUser } from "@clerk/nextjs";
import { useState } from "react"
import { useChatContext } from "stream-chat-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import UserSearch from "./UserSearch";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const NewChatDialog = ({children}: {children: React.ReactNode}) => {
  
    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([]);
    const [groupName, setGroupName] = useState("");
    const createNewChat = useCreateNewChat();
    const {user} = useUser();
    const {setActiveChannel} = useChatContext();

    const handleSelectUser = (user: Doc<"users">) => {
        // avoid adding same user twice
        if (!selectedUsers.find((u) => u._id === user._id)) {
            setSelectedUsers((prev) => [...prev, user]);
        }
    }

    const removeUser = (userId: string) => {
        setSelectedUsers((prev) => 
            prev.filter((user) => {
                user._id !== userId
            })
        )
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setSelectedUsers([]);
            setGroupName("");
        }
    }

    const handleCreateChat = async () => {
        const totalMembers = selectedUsers.length + 1;
        const isGroupChat = totalMembers > 2;

        const channel = await createNewChat({
            members: [
                user?.id as string,
                ...selectedUsers.map((user) => user.userId),
            ],
            createdBy: user?.id as string,
            groupName: isGroupChat ? groupName.trim() || undefined: undefined,
        })

        setActiveChannel(channel);

        setSelectedUsers([]);
        setGroupName("");
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Start a New Chat</DialogTitle>
                    <DialogDescription>
                        Search for users to start a new conversation with.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">

                    {/* Search component */}
                    <UserSearch onSelectUser={handleSelectUser} className="w-full"/>

                    {/* Selected users */}
                    {selectedUsers.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground">
                                Selected users ({selectedUsers.length})
                            </h4>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {selectedUsers.map((user) => (
                                    <div 
                                        key={user._id}
                                        className="flex items-center justify-between p-2 bg-muted/50 border border-border rounded-lg"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Image 
                                                src={user.imageUrl}
                                                alt={user.name}
                                                width={24}
                                                height={24}
                                                className="h-6 w-6 rounded-full object-cover"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeUser(user._id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Group name input for group chats */}
                            {selectedUsers.length > 1 && (
                                <div className="space-y-2">
                                    <label 
                                        htmlFor="groupName"
                                        className="text-sm font-medium text-foreground"
                                    >        
                                        Group Name (Optional)
                                    </label>
                                    <Input 
                                        id="groupName"
                                        type="text"
                                        placeholder="Enter a name for your group chat..."
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty to use default name: &quot;Group Chat(
                                            {selectedUsers.length + 1} members)&quot;
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Dialog footer */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="hover:cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={selectedUsers.length === 0}
                        onClick={handleCreateChat}
                        className="hover:cursor-pointer"
                    >
                        {selectedUsers.length > 1 ? 
                            `Create Group Chat (${selectedUsers.length + 1} members)`
                        : selectedUsers.length === 1 ? "Start Chat": "Create Chat"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
