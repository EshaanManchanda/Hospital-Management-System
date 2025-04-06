
import React, { useState } from "react";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/admin/ui/avatar";
import { 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Image as ImageIcon, 
  Send,
  Filter
} from "lucide-react";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { cn } from "@/lib/utils";

const Messages = () => {
  // Convert TypeScript interfaces/types to JavaScript comments or remove them
  // Example: Mock data structure (would come from an API in a real app)
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Dr. William Chen",
      avatar: "/assets/doctor-1.jpg",
      status: "online",
      lastMessage: "I'll check the lab results and get back to you.",
      time: "10:42 AM",
      unread: 1,
    },
    {
      id: 2,
      name: "Nurse Sarah Johnson",
      avatar: "/assets/nurse-1.jpg",
      status: "online",
      lastMessage: "The patient in room 302 needs assistance.",
      time: "9:15 AM",
      unread: 0,
    },
    {
      id: 3,
      name: "Dr. Michael Rodriguez",
      avatar: "/assets/doctor-3.jpg",
      status: "offline",
      lastMessage: "Can you schedule the surgery for next Thursday?",
      time: "Yesterday",
      unread: 0,
    },
    // Additional contacts would be here
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 1,
      text: "Good morning! I wanted to discuss Mrs. Thompson's case with you.",
      time: "10:30 AM",
      status: "read",
    },
    {
      id: 2,
      senderId: "current-user",
      text: "Good morning, Dr. Chen. I have her file ready. What's your concern?",
      time: "10:35 AM",
      status: "read",
    },
    {
      id: 3,
      senderId: 1,
      text: "Her blood test results show elevated white blood cell count. I think we should run additional tests.",
      time: "10:38 AM",
      status: "read",
    },
    {
      id: 4,
      senderId: "current-user",
      text: "I agree. I'll schedule the tests for today. Do you want to be present during the procedure?",
      time: "10:40 AM",
      status: "sent",
    },
    {
      id: 5,
      senderId: 1,
      text: "I'll check the lab results and get back to you.",
      time: "10:42 AM",
      status: "delivered",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg = {
      id: messages.length + 1,
      senderId: "current-user",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-gray-50">
      <div className="flex flex-col md:flex-row h-full border rounded-lg bg-white shadow overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="flex flex-col divide-y">
              {filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  className={cn(
                    "p-4 hover:bg-gray-50 cursor-pointer",
                    selectedContact.id === contact.id && "bg-gray-50"
                  )}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span 
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                          contact.status === "online" ? "bg-green-500" : "bg-gray-300"
                        )}
                      ></span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 truncate">{contact.name}</h4>
                        <span className="text-xs text-gray-500">{contact.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                    </div>
                    
                    {contact.unread > 0 && (
                      <div className="ml-2 bg-hospital-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedContact.status === "online" ? 
                        "Online" : "Last seen 2h ago"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex",
                        message.senderId === "current-user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.senderId !== "current-user" && (
                        <Avatar className="h-8 w-8 mt-1 mr-2">
                          <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                          <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="max-w-[70%]">
                        <div 
                          className={cn(
                            "rounded-lg px-4 py-2 text-sm",
                            message.senderId === "current-user" ? 
                              "bg-hospital-primary text-white" : 
                              "bg-gray-100 text-gray-800"
                          )}
                        >
                          {message.text}
                        </div>
                        <div 
                          className={cn(
                            "text-xs mt-1",
                            message.senderId === "current-user" ? "text-right" : "text-left"
                          )}
                        >
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    className="bg-hospital-primary hover:bg-hospital-accent"
                    size="icon"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 text-center">
              <div>
                <h3 className="text-gray-500 font-medium text-lg">Select a contact to start messaging</h3>
                <p className="text-gray-400 text-sm mt-1">Choose from your contacts on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
