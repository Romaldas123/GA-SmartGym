<?php
// Display errors for debugging if something goes wrong
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// 1. Import PHPMailer classes (Files are in Backend_Struktur/PHPMailer)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// Set header for JSON response to your register.js
header('Content-Type: application/json');

// 2. Connect to the database
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database Connection Failed"]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? ''); // This is the email the user typed in
    $password = trim($_POST['password'] ?? '');

    if (!empty($name) && !empty($email) && !empty($password)) {

        // Check if email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Email already in use!"]);
        } else {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $token = bin2hex(random_bytes(32));

            // Save user to database (is_verified = 0 by default)
            $stmt = $conn->prepare("INSERT INTO users (name, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, 0)");
            $stmt->bind_param("ssss", $name, $email, $passwordHash, $token);

            if ($stmt->execute()) {
                $user_id = $conn->insert_id;
                
                // CREATE THE LINK (Folder: GA-SMARTGYM)
                $verify_link = "http://localhost/GA-SMARTGYM/Backend_Struktur/verify.php?token=" . $token;

                // --- SEND EMAIL VIA YOUR GMAIL ---
                $mail = new PHPMailer(true);
                $mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
                try {
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = 'blyzaromaldas@gmail.com'; 
                    // YOUR GENERATED APP PASSWORD (zegy uasw nahu kkyl)
                    $mail->Password   = 'zegyuaswnahukkyl'; 
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port       = 587;
                    $mail->CharSet    = 'UTF-8';

                    $mail->setFrom('blyzaromaldas@gmail.com', 'SmartGym');
                    $mail->addAddress($email, $name); // Send to the user who just registered

                    $mail->isHTML(true);
                    $mail->Subject = 'Verify your account - SmartGym';
                    $mail->Body    = "<h1>Welcome $name!</h1>
                                      <p>Thank you for joining SmartGym. Please click the button below to verify your email:</p>
                                      <p><a href='$verify_link' style='background:#22c55e; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; display:inline-block;'>Activate My Account</a></p>
                                      <p>If the button doesn't work, copy this link: <br> $verify_link</p>";

                    $mail->send();
                    echo json_encode(["status" => "success"]);

                } catch (Exception $e) {
                    // If email fails, delete the user so they can try again
                    $conn->query("DELETE FROM users WHERE id = $user_id");
                    echo json_encode(["status" => "error", "message" => "Email could not be sent: {$mail->ErrorInfo}"]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Registration failed in database."]);
            }
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Please fill in all fields!"]);
    }
}
$conn->close();
?>