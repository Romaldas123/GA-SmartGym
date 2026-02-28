<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// Sätt headern så att webbläsaren vet att vi skickar JSON
header('Content-Type: application/json');

// Anslut till databasen
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Databasfel: " . $conn->connect_error]);
    exit();
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
            echo json_encode(["status" => "error", "message" => "E-postadressen används redan!"]);
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

                // Svara med success så JS kan visa popup och sedan skicka vidare användaren
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Fel vid registrering: " . $stmt->error]);
            }
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Alla fält måste fyllas i!"]);
    }
}

$conn->close();
?>