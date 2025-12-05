<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if(!empty($email) && !empty($password)){
        $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result(); 
        $stmt->bind_result($id, $name, $hash);

        if($stmt->num_rows > 0){
            $stmt->fetch();
            if(password_verify($password, $hash)){
                $_SESSION['user_id'] = $id;
                $_SESSION['user_name'] = $name;
               
                header("Location: ../Frontend_Struktur/Webbsidan/webbsida.html");
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
