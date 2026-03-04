<?php
$conn = new mysqli("localhost", "root", "", "ga_project");

$message = "";
$token = $_GET['token'] ?? '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $new_password = $_POST['password'];
    $token = $_POST['token'];

    // Kontrollera om token finns OCH om reset_expires är större än nuvarande tid (NOW())
    $stmt = $conn->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Haspa det nya lösenordet för säkerhet
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // Uppdatera lösenordet och nollställ token-fälten så de inte kan användas igen
        $update = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?");
        $update->bind_param("si", $hashed_password, $user['id']);
        $update->execute();

        $message = "Ditt lösenord har ändrats! <a href='../Frontend_Struktur/Frontend_register/register.html' style='color:#22c55e;'>Klicka här for att logga in.</a>";
    } else {
        $message = "Länken ar ogiltig eller har gått ut (5 minuter har passerat).";
    }
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Nytt Losenord</title>
    <style>
        body { font-family: sans-serif; background: #0f172a; color: white; text-align: center; padding-top: 50px; }
        form { background: #1e293b; display: inline-block; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
        input { display: block; margin: 10px auto; padding: 10px; width: 250px; border-radius: 4px; border: none; }
        button { background: #22c55e; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <h2>Välj nytt lösenord</h2>
    <p><?php echo $message; ?></p>
    
    <?php if ($message == "" || strpos($message, "ogiltig") !== false): ?>
    <form method="POST">
        <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
        <input type="password" name="password" placeholder="Nytt lösenord" required minlength="6">
        <button type="submit">Spara lösenord</button>
    </form>
    <?php endif; ?>
</body>
</html>