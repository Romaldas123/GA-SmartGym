<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../../Backend_Struktur/login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>GA SmartGym - Chat (AI)</title>
    <link rel="stylesheet" href="../Header/header.css">
    <link rel="stylesheet" href="chatten.css">
    <link rel="stylesheet" href="../footer/footer.css">
</head>
<body>

<?php include '../Header/header.html'; ?>

<main class="chat-container">
    <h1>Chat (AI Coach)</h1>

    <div id="chatBox" class="chat-box">
        <div class="message bot">Hej! Hur kan jag hjälpa dig med träningen idag?</div>
    </div>

    <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Skriv ditt meddelande...">
        <button id="sendBtn">Skicka</button>
    </div>
</main>

<?php include '../footer/footer.html'; ?>

<script src="../Header/header.js"></script>
<script src="chatten.js"></script>
<script src="../footer/footer.js"></script>
</body>
</html>