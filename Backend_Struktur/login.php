<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// Databasanslutning
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$error = '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!empty($email) && !empty($password)) {
        $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id, $name, $hash);

        if ($stmt->num_rows > 0) {
            $stmt->fetch();
            if(password_verify($password, $hash)){
                $_SESSION['user_id'] = $id;
                $_SESSION['user_name'] = $name;

                header("Location: ../Frontend_Struktur/Webbsidan/struktur/struktur.php");
                exit();
            } else {
                $error = "Fel lösenord!";
            }
        } else {
            $error = "Ingen användare med den e-posten hittades!";
        }
        $stmt->close();
    } else {
        $error = "Alla fält måste fyllas i!";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>GA SmartGym - Login</title>
    <style>
        body { font-family: Arial, sans-serif; background: #111827; color: #e5e7eb; display:flex; justify-content:center; align-items:center; height:100vh; }
        form { background: #1f2937; padding:30px; border-radius:16px; }
        input { width:100%; padding:12px; margin:8px 0; border-radius:12px; border:none; }
        button { padding:12px 20px; border-radius:12px; border:none; background:#22c55e; color:#05110a; font-weight:bold; cursor:pointer; }
        button:hover { background:#16a34a; }
        .error { color:red; margin-bottom:12px; }
    </style>
</head>
<body>
    <form method="POST" action="">
        <h2>Login</h2>
        <?php if(!empty($error)) echo "<div class='error'>$error</div>"; ?>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Lösenord" required>
        <button type="submit">Logga in</button>
    </form>
</body>
</html>