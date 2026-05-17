import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useChat = () => {
  const authStore = useAuthStore();
  const messages = useState<any[]>("chat_messages", () => []);
  const isConnected = useState("chat_connected", () => false);
  const isTyping = useState("chat_typing", () => false);
  const unreadCount = useState("chat_unread", () => 0);
  const roomId = useState<number | null>("chat_room_id", () => null);

  function connect() {
    if (socket?.connected) return;
    if (!authStore.isAuthenticated) return;

    socket = io(
      `${useRuntimeConfig().public.apiBase.replace("/api", "")}/chat`,
      {
        withCredentials: true,
        transports: ["websocket"],
        auth: { type: "user" },
      },
    );

    socket.on("connect", () => {
      isConnected.value = true;
      socket!.emit("join_room");
    });

    socket.on("room_joined", (room: any) => {
      roomId.value = room.id;
      messages.value = room.messages || [];
    });

    socket.on("disconnect", () => {
      isConnected.value = false;
    });

    socket.on("new_message", (msg: any) => {
      messages.value.push(msg);
      if (!isChatOpen.value && msg.sender?.role === "ADMIN") {
        unreadCount.value++;
      }
    });

    socket.on("user_typing", (data: any) => {
      if (data.role === "ADMIN") isTyping.value = data.isTyping;
    });
  }

  function disconnect() {
    socket?.disconnect();
    socket = null;
    messages.value = [];
    isConnected.value = false;
  }

  function sendMessage(content: string) {
    if (!socket?.connected || !content.trim()) return;
    socket.emit("send_message", { content });
  }

  let typingTimer: ReturnType<typeof setTimeout>;
  function emitTyping() {
    if (!roomId.value) return;
    socket?.emit("typing", { roomId: roomId.value, isTyping: true });
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      socket?.emit("typing", { roomId: roomId.value, isTyping: false });
    }, 1500);
  }

  const isChatOpen = useState("chat_open", () => false);
  function toggleChat() {
    isChatOpen.value = !isChatOpen.value;
    if (isChatOpen.value) unreadCount.value = 0;
  }

  return {
    messages,
    isConnected,
    isTyping,
    unreadCount,
    roomId,
    isChatOpen,
    connect,
    disconnect,
    sendMessage,
    emitTyping,
    toggleChat,
  };
};
