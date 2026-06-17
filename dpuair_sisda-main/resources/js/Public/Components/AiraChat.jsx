import { useEffect, useState, useRef } from "react";
import "@/../css/chat.css";

export default function AiraChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false)
    const openChat = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const messagesContainerRef = useRef(null);

    const closeChat = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    const sendMessage = async () => {
        const trimmedInput = input.trim();

        if (!trimmedInput) return;

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: trimmedInput,
            },
        ]);
        setInput("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("message", trimmedInput)

            const response = await fetch("http://127.0.0.1:8000/chat/send",{
                method:"POST",
                body: formData,
                headers:{
                    Accept: "application/json",
                    }
                }
            );
            if(!response.ok){
                throw new Error("Failed to send message");
            }

            const data = await response.json();

            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: data.message,
                        source: data.source,
                        sourceInfo: data.source_info,
                    },
                ]);
            }
        }catch(error){
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Maaf, terjadi kesalahan saat menghubungi AIRA.",
                },
            ]);
            
        } finally {
            setLoading(false);
        }
    };

    const LoadHistory = async () => {
        try{
            const response =  await fetch("http://127.0.0.1:8000/chat/history",{
                headers: {
                    Accept: "application/json",
                },
            });

            if(!response.ok){
                throw new Error("failed fetch history");
            }

            const data =await response.json();

            if(data.success && data.chats.length > 0){
                setMessages(
                    data.chats.map((chat) => ({
                        role: chat.sender === "bot"
                            ? "assistant"
                            : "user",
                        text: chat.message,
                        id: chat.id,
                        createdAt: chat.created_at,
                    }))
                );
            }else { 
                setMessages([ { 
                    role: "assistant", 
                    text: "Selamat Datang di Live Chat Aira, ada yang bisa saya bantu?", 
                }, ]); }

        }catch(error){
            console.error("History error:", error);

            setMessages([{ role: "assistant", text: "Selamat Datang di Live Chat Aira, ada yang bisa saya bantu?", }]);
        }
    };

    useEffect(() => {
        if(isOpen&& !historyLoaded){
            LoadHistory();
            setHistoryLoaded(true);
        }
    },[isOpen, historyLoaded])

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
    }, [messages, loading]);

    return (
        <div className="aira-chat-widget">
            {!isOpen && (
                <button
                    type="button"
                    className="aira-chat-trigger"
                    onClick={openChat}
                >
                    <span className="aira-avatar-container">
                        <img src="/assets/images/airo.png" alt="AIRA" />
                    </span>
                    <span className="aira-chat-button">Tanya Aira</span>
                </button>
            )}

            {isOpen && isMinimized && (
                <button
                    type="button"
                    className="aira-chat-trigger"
                    onClick={() => setIsMinimized(false)}
                >
                    <span className="aira-avatar-container">
                        <img src="/assets/images/airo.png" />
                    </span>
                    <span className="aira-chat-button">Buka Aira</span>
                </button>
            )}

            {isOpen && !isMinimized && (
                <section className="aira-chat-popup" aria-label="Aira chat">
                    <header className="aira-chat-header">
                        <h3>Aira</h3>

                        <div className="aira-header-buttons">
                            <button
                                type="button"
                                className="aira-minimize-btn"
                                onClick={() => setIsMinimized(true)}
                                title="Minimize"
                            >
                                -
                            </button>

                            <button
                                type="button"
                                className="aira-close-btn"
                                onClick={closeChat}
                                title="Close & Save"
                            >
                                &times;
                            </button>
                        </div>
                    </header>

                    <div className="aira-chat-messages" ref={messagesContainerRef}>
                        {messages.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`aira-message ${
                                    message.role === "user"
                                        ? "aira-user"
                                        : "aira-bot"
                                }`}
                            >
                                <div className="aira-message-bubble">
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading && (
                        <div className="aira-loading-indicator">
                            <div className="aira-spinner"></div>
                            <span>Aira sedang mengetik...</span>
                        </div>
                    )}

                    <div className="aira-chat-input-container">
                        <input
                            type="text"
                            className="aira-chat-input"
                            placeholder="Ketik pesan Anda..."
                            autoComplete="off"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />

                        <button
                            type="button"
                            className="aira-send-btn"
                            onClick={sendMessage}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
