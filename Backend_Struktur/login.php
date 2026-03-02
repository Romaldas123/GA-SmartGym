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