<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// Anslut till databasen
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!empty($email) && !empty($password)) {

        // Hämta användaren från databasen
        $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            // Kontrollera lösenord
            if (password_verify($password, $user['password'])) {
                // Sätt sessionvariabler
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];

                // Skicka vidare till startsidan
                header("Location: ../Frontend_Struktur/Webbsidan/struktur/struktur.php");
                exit();
            } else {
                echo "Fel lösenord!";
            }
        } else {
            echo "Ingen användare med den e-posten hittades!";
        }

        $stmt->close();
    } else {
        echo "Alla fält måste fyllas i!";
    }
}

$conn->close();
?>