<?php
session_start(); // Viktigt för sessioner och användarnamn
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

<main>
    <h1>Chat (AI)</h1>
    <p>Här kan användaren chatta med AI-assistenten.</p>

    <!-- Exempel på chat-box -->
    <div id="chatBox">
        <div class="message bot">Hej! Hur kan jag hjälpa dig med träningen idag?</div>
    </div>

    <input type="text" id="chatInput" placeholder="Skriv meddelande...">
    <button id="sendBtn">Skicka</button>
</main>

<?php include '../footer/footer.html'; ?>

<script src="../Header/header.js"></script>
<script src="chatten.js"></script>
<script src="../footer/footer.js"></script>

</body>
</html>
