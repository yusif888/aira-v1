/**
 * ========================================
 * AIRA Chatbot - JavaScript Handler
 * ========================================
 * 
 * Menangani interaksi chat, AJAX requests,
 * dan real-time messaging tanpa reload
 * 
 * Developer: Yusif, S.Kom
 * Date: November 19, 2025
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // === DOM Elements ===
    const chatTrigger = document.getElementById('chatTrigger');
    const chatPopup = document.getElementById('chatPopup');
    const closeChat = document.getElementById('closeChat');
    const minimizeChat = document.getElementById('minimizeChat');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // === CSRF Token untuk Laravel ===
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // === Event Listeners ===
    
    // Toggle chat popup
    chatTrigger.addEventListener('click', function() {
        chatPopup.classList.add('show');
        chatTrigger.classList.add('hidden');
        loadChatHistory();
    });

    // Minimize chat (chat tetap ada, hanya hide)
    minimizeChat.addEventListener('click', function() {
        chatPopup.classList.remove('show');
        chatTrigger.classList.remove('hidden');
        // Tidak clear history, hanya minimize UI
    });

    // Close chat & save to learning data
    closeChat.addEventListener('click', function() {
        // Konfirmasi sebelum close
        if (confirm('Apakah anda yakin akan menutup chat?. Semua history percakapan akan dihapus')) {
            clearChatHistory();
        }
    });

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key press
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // === Functions ===

    /**
     * Load chat history dari server
     * Dipanggil saat chat popup dibuka
     */
    function loadChatHistory() {
        fetch('/chat/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                chatMessages.innerHTML = '';
                
                if (data.chats.length === 0) {
                    // Add welcome message
                    addMessage('bot', 'Selamat Datang di Live Chat Aira, ada yang bisa saya bantu?');
                } else {
                    data.chats.forEach(chat => {
                        addMessage(chat.sender, chat.message, false);
                    });
                }
                scrollToBottom();
            }
        })
        .catch(error => {
            console.error('Error loading chat history:', error);
            addMessage('bot', 'Selamat Datang di Live Chat Aira, ada yang bisa saya bantu?');
        });
    }

    /**
     * Send message ke server
     * Handle response dan tampilkan di UI
     */
    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message === '') return;

        // Add user message to UI
        addMessage('user', message);
        chatInput.value = '';
        
        // Show loading indicator
        loadingIndicator.classList.add('show');
        sendBtn.disabled = true;

        // Send to server
        fetch('/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.classList.remove('show');
            sendBtn.disabled = false;
            
            if (data.success) {
                addMessage('bot', data.message);
            } else {
                addMessage('bot', 'Maaf, terjadi kesalahan. Silakan coba lagi.');
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            loadingIndicator.classList.remove('show');
            sendBtn.disabled = false;
            addMessage('bot', 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.');
        });
    }

    /**
     * Tambah message bubble ke chat UI
     * @param {string} sender - 'user' atau 'bot'
     * @param {string} message - Isi pesan
     * @param {boolean} shouldScroll - Auto scroll ke bawah
     */
    function addMessage(sender, message, shouldScroll = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = message;
        
        messageDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(messageDiv);
        
        if (shouldScroll) {
            scrollToBottom();
        }
    }

    /**
     * Clear chat history & save to learning data
     * Dipanggil saat tombol Close diklik
     */
    function clearChatHistory() {
        fetch('/chat/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear UI
                chatMessages.innerHTML = '';
                
                // Close popup
                chatPopup.classList.remove('show');
                chatTrigger.classList.remove('hidden');
                
                // Optional: Show notification
                console.log('Chat history saved for learning');
            }
        })
        .catch(error => {
            console.error('Error clearing chat:', error);
            // Tetap close meskipun error
            chatPopup.classList.remove('show');
            chatTrigger.classList.remove('hidden');
        });
    }

    /**
     * Scroll chat ke bawah (pesan terbaru)
     * Menggunakan setTimeout untuk menunggu render selesai
     */
    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
});
