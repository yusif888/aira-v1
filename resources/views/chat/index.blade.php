<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AIRA - Asisten Virtual Dinas PU Sumber Daya Air</title>
    
    <!-- External Stylesheet -->
    <link rel="stylesheet" href="{{ asset('css/chat.css') }}">
    
    <!-- Inline style untuk background image (Blade syntax) -->
    <style>
        .main-container {
            background-image: url('{{ asset('assets/images/airafull1.png') }}');
        }
    </style>
</head>
<body>
    <div class="main-container">
        <div class="welcome-text">
            Selamat Datang di AIRA<br>
            Asisten Virtual Dinas PU Sumber Daya Air
        </div>

        <!-- Trigger button -->
        <div class="chat-trigger" id="chatTrigger">
            <div class="avatar-container">
                <img src="{{ asset('assets/images/airo.png') }}" alt="AIRA">
            </div>
            <div class="chat-button">Tanya Aira</div>
        </div>

        <!-- Chat popup -->
        <div class="chat-popup" id="chatPopup">
            <div class="chat-header">
                <h3>Aira</h3>
                <div class="header-buttons">
                    <button class="minimize-btn" id="minimizeChat" title="Minimize">−</button>
                    <button class="close-btn" id="closeChat" title="Close & Save">&times;</button>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <!-- Messages will be inserted here -->
            </div>

            <div class="loading-indicator" id="loadingIndicator">
                <div class="spinner"></div>
                <span>Aira sedang mengetik...</span>
            </div>

            <div class="chat-input-container">
                <input 
                    type="text" 
                    class="chat-input" 
                    id="chatInput" 
                    placeholder="Ketik pesan Anda..."
                    autocomplete="off"
                >
                <button class="send-btn" id="sendBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/chat.js') }}"></script>
</body>
</html>
