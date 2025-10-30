<?php
// Visa fel i XAMPP
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Koppla till din databas
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Hantera POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if(!empty($name) && !empty($email) && !empty($password)){
        // Hasha lösenordet
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Förberedd statement
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $passwordHash);

        if($stmt->execute()){
            echo "Registrering lyckades! <a href='fragor.html'>Gå vidare till frågorna</a>";
        } else {
            // Exempel: e-mail redan används
            echo "Fel: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Alla fält måste fyllas i!";
    }
}

$conn->close();
?>
