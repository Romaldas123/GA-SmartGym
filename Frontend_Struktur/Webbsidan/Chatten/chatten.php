<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../../Backend_Struktur/login.php");
    exit();
}

$user_name = $_SESSION['user_name'] ?? "Medlem";

// Initialize chat history if it doesn't exist
if (!isset($_SESSION['chat_history'])) {
    $_SESSION['chat_history'] = [];
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['message'])) {
    header('Content-Type: application/json');
    
    $userMessage = trim($_POST['message']);
    
    if (empty($userMessage)) {
        echo json_encode(['error' => 'Tom meddelande']);
        exit;
    }

    // Add user message to chat history
    $_SESSION['chat_history'][] = [
        'role' => 'user',
        'content' => $userMessage
    ];

    // OpenRouter API Key
    $apiKey = "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"; 
    
    // Build messages for API call
    $messages = [
        [
            'role' => 'system',
            'content' => 'Du är en professionell träningscoach för GA SmartGym. Du hjälper med träningsprogram, kostrådgivning, motivation och återhämtning. Du svarar på svenska och ger praktiska, användbara tips. Fokusera på styrketräning och fitness.'
        ]
    ];

    // Merge previous messages from session
    $messages = array_merge($messages, $_SESSION['chat_history']);

    $ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
    
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json'
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'model' => 'openrouter/free',
            'messages' => $messages,
            'temperature' => 0.7,
            'max_tokens' => 500
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $aiMessage = $data['choices'][0]['message']['content'] ?? 'Något gick fel';

        // Add AI response to chat history
        $_SESSION['chat_history'][] = [
            'role' => 'assistant',
            'content' => $aiMessage
        ];

        echo json_encode(['success' => true, 'message' => $aiMessage]);
    } else {
        $error = json_decode($response, true);
        echo json_encode(['error' => 'API fel: ' . ($error['error']['message'] ?? 'Okänt fel')]);
    }
    exit;
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GA SmartGym - AI Coach</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">

    <!-- CSS with cache busting -->
    <link rel="stylesheet" href="chatten.css?v=3.0">
</head>
<body>

<!-- ===== NAVBAR ===== -->
<header class="navbar">
    <div class="logo">
        <div class="logo-box">GA</div>
        <div>
            <h2>GA SmartGym</h2>
            <p>AI Coach</p>
        </div>
    </div>

    <nav>
        <a href="../struktur/struktur.php">Hem</a>
        <a href="../schema/schema.php">Schema</a>
        <a href="chatten.php" class="active">AI Coach</a>
        <a href="../../Backend_Struktur/fragor.php">Frågor</a>
        <a href="../../Backend_Struktur/logout.php" class="logout">Logga ut</a>
    </nav>
</header>

<!-- ===== HERO ===== -->
<section class="chat-hero">
    <h1>🤖 AI Coach (ChatGPT Powered)</h1>
    <p>Få intelligenta svar från en riktig AI om träning, kost och motivation</p>
</section>

<!-- ===== MAIN CHAT ===== -->
<main class="chat-container">

    <div class="chat-wrapper">
        <div id="chatBox" class="chat-box">
            <div class="message bot">
                <div class="bot-avatar">🤖</div>
                <div class="message-content">
                    <p>Hej! 👋 Jag är din AI Coach!</p>
                    <p>Jag är driven av ChatGPT och kan hjälpa med:</p>
                    <ul>
                        <li>✓ Träningsprogram och övningar</li>
                        <li>✓ Kostrådgivning och näring</li>
                        <li>✓ Motivation och mentaltips</li>
                        <li>✓ Återhämtning och skador</li>
                    </ul>
                    <p>Ställ mig vilken fråga som helst! 💪</p>
                </div>
            </div>
        </div>

        <div class="chat-input-area">
            <input 
                type="text" 
                id="chatInput" 
                placeholder="Fråga något om träning, kost eller motion..." 
                autocomplete="off"
            >
            <button id="sendBtn">Skicka</button>
        </div>

        <div class="chat-info">
            <p>⚡ Powered by ChatGPT | Svar på svenska</p>
        </div>
    </div>

</main>

<!-- ===== FOOTER ===== -->
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h4>GA SmartGym</h4>
            <p>Din kompletta träningsplattform</p>
        </div>
        <div class="footer-section">
            <h4>Snabblänkar</h4>
            <ul>
                <li><a href="../struktur/struktur.php">Hem</a></li>
                <li><a href="../schema/schema.php">Schema</a></li>
                <li><a href="chatten.php">AI Coach</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 GA SmartGym. Alla rättigheter förbehållna.</p>
    </div>
</footer>

<!-- ===== JAVASCRIPT ===== -->
<script src="chatten.js?v=2.0"></script>

</body>
</html>