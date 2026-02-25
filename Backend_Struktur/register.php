<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// Anslut till databasen
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Kolla om POST skickats
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!empty($name) && !empty($email) && !empty($password)) {

        // Kolla om e-posten redan används
        $stmt = $conn->prepare("SELECT id FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo "E-postadressen används redan!";
        } else {
            // Hasha lösenordet
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            // Lägg till användaren
            $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $email, $passwordHash);

            if ($stmt->execute()) {
                // Få senaste ID och spara i sessionen
                $user_id = $conn->insert_id;
                $_SESSION['user_id'] = $user_id;
                $_SESSION['user_name'] = $name;

                // Skicka vidare till fragor.html
                header("Location: ../Frontend_Struktur/frontend_fragor/fragor.html");
                exit();
            } else {
                echo "Fel: " . $stmt->error;
            }
        }

        $stmt->close();
    } else {
        echo "Alla fält måste fyllas i!";
    }
}

$conn->close();
?>

