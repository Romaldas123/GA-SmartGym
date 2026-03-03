<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Anslutningsfel"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!empty($email) && !empty($password)) {
        // --- ÄNDRAT: Vi hämtar även is_verified från databasen ---
        $stmt = $conn->prepare("SELECT id, name, password, is_verified FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        // --- ÄNDRAT: Binder resultatet till variabeln $is_verified ---
        $stmt->bind_result($id, $name, $hash, $is_verified);

        if ($stmt->num_rows > 0) {
            $stmt->fetch();
            if(password_verify($password, $hash)){
                
                // --- NYTT: Spärr som kollar om kontot är verifierat ---
                if ($is_verified == 0) {
                    echo json_encode(["status" => "error", "message" => "Du måste verifiera din e-post innan du kan logga in!"]);
                    exit; // Stoppar koden här så inloggningen avbryts
                }
                // ------------------------------------------------------

                $_SESSION['user_id'] = $id;
                $_SESSION['user_name'] = $name;
                
                // Vi skickar bara ett svar att det gick bra
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Fel lösenord!"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Användaren finns inte!"]);
        }
        $stmt->close();
    }
}
$conn->close();
?>