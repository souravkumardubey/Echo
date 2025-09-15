'use client'

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs"
import { channel } from "diagnostics_channel";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Channel, ChannelHeader, MessageInput, MessageList, Thread, useChatContext, Window } from "stream-chat-react";

const Dashboard = () => {

  const {user} = useUser();
  const router = useRouter();
  const {channel, setActiveChannel} = useChatContext();
  const {setOpen} = useSidebar();

  const handleCall = () => {
    if (!channel) return;
    router.push(`/dashboard/video-call/${channel.id}`)
    setOpen(false);
  }

  const handleLeaveChat = async () => {
    if (!channel || !user?.id) {
      console.log("No active channel or user");
      return;
    }

    const confirm = window.confirm("Are you sure you want to leave the chat?");
    if (!confirm) return;

    try {
      await channel.removeMembers([user.id])
      setActiveChannel(undefined)
      router.push("/dashboard");
    } catch (error) {
      console.error("Error leaving chat:", error);
    }
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex items-center justify-between">
              {
                channel.data?.member_count === 1 ? (
                  <ChannelHeader title="Everyone else have left this chat!" />
                ) : (
                  <ChannelHeader />
                )
              }

              <div className="flex items-center gap-2">
                <Button variant='outline' onClick={handleCall} className="hover:cursor-pointer">
                  <VideoIcon className="w-4 h-4 hover:cursor-pointer" />
                  Video Call
                </Button>

                <Button 
                  variant='outline'
                  onClick={handleLeaveChat}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 hover:cursor-pointer"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Leave Chat
                </Button>
              </div>
            </div>

            <MessageList />
            <div className="sticky bottom-0w-full">
              <MessageInput focus />
            </div>
          </Window>
          <Thread />
        </Channel>
      ): (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            No chat selected
          </h2>
          <p className="text-muted-foreground">
            Select a chat from the sidebar or start a new conversation.
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard