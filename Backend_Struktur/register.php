<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if(!empty($name) && !empty($email) && !empty($password)) {
       
        $stmt = $conn->prepare("SELECT id FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result(); 

        if($stmt->num_rows > 0){
            echo "E-postadressen används redan!";
        } else {
          
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $email, $passwordHash);

            if($stmt->execute()){
            
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
