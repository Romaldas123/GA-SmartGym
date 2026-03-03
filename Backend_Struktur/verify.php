<?php
// Starta sessionen så vi kan logga in användaren efter verifiering
session_start();

// Anslut till databasen
$conn = new mysqli("localhost", "root", "", "ga_project");

if ($conn->connect_error) {
    die("Anslutning misslyckades: " . $conn->connect_error);
}

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Kolla om det finns en användare med detta token
    $stmt = $conn->prepare("SELECT id, name FROM users WHERE verification_token = ? LIMIT 1");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $user_id = $user['id'];
        $user_name = $user['name'];
        
        // 1. Uppdatera användaren: sätt is_verified till 1 och rensa token
        $update = $conn->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?");
        $update->bind_param("i", $user_id);
        
        if ($update->execute()) {
            // 2. Logga in användaren automatiskt i sessionen
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $user_name;

            // 3. Visa ett snyggt meddelande och skicka vidare till din HTML-sida
            echo "<!DOCTYPE html>
            <html lang='sv'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Verifiering Klar</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .container { text-align: center; background: #1e293b; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 1px solid #334155; }
                    h1 { color: #22c55e; margin-bottom: 10px; }
                    p { color: #94a3b8; font-size: 1.1rem; }
                    .loader { border: 4px solid #334155; border-top: 4px solid #22c55e; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 20px auto; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
                <meta http-equiv='refresh' content='3;url=http://localhost/GA-SMARTGYM/Frontend_Struktur/frontend_fragor/fragor.html'>
            </head>
            <body>
                <div class='container'>
                    <h1>Verifiering klar!</h1>
                    <p>Välkommen " . htmlspecialchars($user_name) . ", ditt konto är nu aktiverat.</p>
                    <div class='loader'></div>
                    <p>Skickar dig vidare till dina frågor...</p>
                </div>
            </body>
            </html>";
            exit();
        }
    } else {
        echo "<div style='text-align:center; padding-top:50px; color:white; background-color:#0f172a; height:100vh; font-family:sans-serif;'>
                <h1>Ogiltig länk</h1>
                <p>Länken har redan använts eller är felaktig.</p>
                <a href='http://localhost/GA-SMARTGYM/Webbsidan/index.html' style='color:#22c55e;'>Gå till startsidan</a>
              </div>";
    }
} else {
    header("Location: http://localhost/GA-SMARTGYM/Webbsidan/index.html");
    exit();
}

$conn->close();
?>