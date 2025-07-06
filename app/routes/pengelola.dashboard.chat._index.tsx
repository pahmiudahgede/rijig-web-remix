import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image,
  MapPin,
  Clock,
  Check,
  CheckCheck,
  User,
  MessageCircle,
  Truck,
  Package,
  AlertCircle
} from "lucide-react";

// Interfaces
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "location" | "document";
  status: "sent" | "delivered" | "read";
  attachmentUrl?: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: string;
  lastMessage: string;
  unreadCount: number;
  location?: string;
  phone: string;
}

interface ChatData {
  contacts: Contact[];
  messages: { [contactId: string]: Message[] };
  currentUser: {
    id: string;
    name: string;
  };
}

export const loader = async (): Promise<Response> => {
  // Mock data - dalam implementasi nyata, ambil dari database
  const chatData: ChatData = {
    currentUser: {
      id: "pengelola-001",
      name: "Ahmad Pengelola"
    },
    contacts: [
      {
        id: "pengepul-001",
        name: "Budi Santoso",
        role: "Driver Truk B-001",
        avatar: "",
        isOnline: true,
        lastSeen: "Online",
        lastMessage: "Sampah sudah diangkut semua pak",
        unreadCount: 2,
        location: "Kelurahan Merdeka",
        phone: "081234567890"
      },
      {
        id: "pengepul-002",
        name: "Sari Dewi",
        role: "Driver Truk B-003",
        avatar: "",
        isOnline: false,
        lastSeen: "15 menit yang lalu",
        lastMessage: "Baik pak, segera ke lokasi",
        unreadCount: 0,
        location: "Komplek Permata",
        phone: "081234567891"
      },
      {
        id: "pengepul-003",
        name: "Dedi Kurniawan",
        role: "Driver Truk B-004",
        avatar: "",
        isOnline: true,
        lastSeen: "Online",
        lastMessage: "Truk sedang dalam perjalanan",
        unreadCount: 1,
        location: "Jl. Sudirman",
        phone: "081234567892"
      },
      {
        id: "pengepul-004",
        name: "Andi Wijaya",
        role: "Driver Truk B-002",
        avatar: "",
        isOnline: false,
        lastSeen: "2 jam yang lalu",
        lastMessage: "Maintenance selesai besok pagi",
        unreadCount: 0,
        location: "Workshop",
        phone: "081234567893"
      },
      {
        id: "pengepul-005",
        name: "Rini Astuti",
        role: "Supervisor Lapangan",
        avatar: "",
        isOnline: true,
        lastSeen: "Online",
        lastMessage: "Laporan harian sudah dikirim",
        unreadCount: 0,
        location: "Pool Kendaraan",
        phone: "081234567894"
      }
    ],
    messages: {
      "pengepul-001": [
        {
          id: "msg-001",
          senderId: "pengepul-001",
          senderName: "Budi Santoso",
          content:
            "Selamat pagi pak, saya sudah sampai di lokasi Kelurahan Merdeka",
          timestamp: "08:00",
          type: "text",
          status: "read"
        },
        {
          id: "msg-002",
          senderId: "pengelola-001",
          senderName: "Ahmad Pengelola",
          content: "Pagi Bud, bagus. Berapa estimasi waktu pengangkutan?",
          timestamp: "08:02",
          type: "text",
          status: "read"
        },
        {
          id: "msg-003",
          senderId: "pengepul-001",
          senderName: "Budi Santoso",
          content: "Sekitar 2 jam pak, volume sampah cukup banyak hari ini",
          timestamp: "08:05",
          type: "text",
          status: "read"
        },
        {
          id: "msg-004",
          senderId: "pengepul-001",
          senderName: "Budi Santoso",
          content: "Sampah sudah diangkut semua pak",
          timestamp: "10:30",
          type: "text",
          status: "delivered"
        },
        {
          id: "msg-005",
          senderId: "pengepul-001",
          senderName: "Budi Santoso",
          content: "Total 245 kg, lanjut ke lokasi berikutnya?",
          timestamp: "10:31",
          type: "text",
          status: "sent"
        }
      ],
      "pengepul-002": [
        {
          id: "msg-006",
          senderId: "pengelola-001",
          senderName: "Ahmad Pengelola",
          content: "Sari, bisa ke Komplek Permata sekarang?",
          timestamp: "09:15",
          type: "text",
          status: "read"
        },
        {
          id: "msg-007",
          senderId: "pengepul-002",
          senderName: "Sari Dewi",
          content: "Baik pak, segera ke lokasi",
          timestamp: "09:17",
          type: "text",
          status: "read"
        }
      ],
      "pengepul-003": [
        {
          id: "msg-008",
          senderId: "pengepul-003",
          senderName: "Dedi Kurniawan",
          content:
            "Pak, ada kemacetan di Jl. Sudirman, mungkin terlambat 30 menit",
          timestamp: "11:00",
          type: "text",
          status: "read"
        },
        {
          id: "msg-009",
          senderId: "pengelola-001",
          senderName: "Ahmad Pengelola",
          content: "OK Ded, hati-hati di jalan. Update terus ya",
          timestamp: "11:05",
          type: "text",
          status: "read"
        },
        {
          id: "msg-010",
          senderId: "pengepul-003",
          senderName: "Dedi Kurniawan",
          content: "Truk sedang dalam perjalanan",
          timestamp: "11:45",
          type: "text",
          status: "delivered"
        }
      ]
    }
  };

  return json(chatData);
};

export default function ChatPengepul() {
  const data = useLoaderData<ChatData>();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    data.contacts[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Filter contacts berdasarkan search
  const filteredContacts = data.contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get messages untuk contact yang dipilih
  const currentMessages = selectedContact
    ? data.messages[selectedContact.id] || []
    : [];

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    // Implementasi kirim pesan (dalam real app, hit API)
    console.log("Sending message:", messageInput, "to:", selectedContact.name);
    setMessageInput("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getContactStatusBadge = (contact: Contact) => {
    if (contact.isOnline) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 text-xs"
        >
          Online
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        {contact.lastSeen}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Chat Pengepul</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="mr-2 h-4 w-4" />
            Panggil Semua
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            Broadcast
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Sidebar Contact List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari pengepul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-1 p-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {contact.name}
                          </p>
                          {contact.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="h-5 w-5 p-0 text-xs flex items-center justify-center"
                            >
                              {contact.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Truck className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500 truncate">
                            {contact.role}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {contact.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {contact.location}
                            </span>
                          </div>
                          {getContactStatusBadge(contact)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>
                      {selectedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedContact.name}</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">
                        {selectedContact.role}
                      </p>
                      {getContactStatusBadge(selectedContact)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Lihat Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MapPin className="mr-2 h-4 w-4" />
                        Lacak Lokasi
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        Riwayat Tugas
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <Separator />

              {/* Messages Area */}
              <CardContent className="flex-1 p-4">
                <ScrollArea
                  className="h-[calc(100vh-420px)]"
                  ref={scrollAreaRef}
                >
                  <div className="space-y-4">
                    {currentMessages.map((message) => {
                      const isOwnMessage =
                        message.senderId === data.currentUser.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOwnMessage
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`flex items-center justify-between mt-2 ${
                                isOwnMessage
                                  ? "text-primary-foreground/70"
                                  : "text-gray-500"
                              }`}
                            >
                              <span className="text-xs">
                                {message.timestamp}
                              </span>
                              {isOwnMessage && (
                                <div className="ml-2">
                                  {getStatusIcon(message.status)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Image className="mr-2 h-4 w-4" />
                        Kirim Foto
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MapPin className="mr-2 h-4 w-4" />
                        Bagikan Lokasi
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        Kirim Dokumen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex-1 flex space-x-2">
                    <Textarea
                      placeholder="Ketik pesan..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="min-h-[40px] max-h-[120px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Pilih Chat
                </h3>
                <p className="text-gray-500">
                  Pilih pengepul untuk mulai berkomunikasi
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
