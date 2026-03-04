<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$conn = new mysqli("localhost", "root", "", "ga_project");

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    
    $stmt = $conn->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $token = bin2hex(random_bytes(32));
        $expires = date("Y-m-d H:i:s", strtotime("+5 minutes"));

        $stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?");
        $stmt->bind_param("sss", $token, $expires, $email);
        $stmt->execute();

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'blyzaromaldas@gmail.com';
            $mail->Password   = 'zegyuaswnahukkyl'; 
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );

            $mail->setFrom('blyzaromaldas@gmail.com', 'SmartGym');
            $mail->addAddress($email);

            $reset_link = "http://localhost/GA-SMARTGYM/Backend_Struktur/reset_password.php?token=" . $token;

            $mail->isHTML(true);
            $mail->Subject = 'Återställ lösenord - SmartGym';
            
            // HÄR ÄR DEN NYA DESIGNEN FÖR MEJLET
            $mail->Body = "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;'>
                    <h2 style='color: #0f172a; text-align: center;'>Hej " . htmlspecialchars($user['name']) . "!</h2>
                    <p style='color: #4b5563; font-size: 16px; line-height: 1.5; text-align: center;'>
                        Vi har fått en förfrågan om att återställa lösenordet för ditt SmartGym-konto. 
                        Klicka på knappen nedan för att välja ett nytt lösenord.
                    </p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='$reset_link' style='background-color: #22c55e; color: white; padding: 14px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;'>Återställ lösenord</a>
                    </div>
                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                        Denna länk är giltig i 5 minuter. Om du inte har begärt detta kan du ignorera mejlet.
                    </p>
                    <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                        Om knappen inte fungerar, kopiera denna länk: <br>
                        <a href='$reset_link' style='color: #22c55e;'>$reset_link</a>
                    </p>
                </div>";

            $mail->send();
            $message = "Ett återställningsmejl har skickats!";
        } catch (Exception $e) {
            $message = "Kunde inte skicka mejl. Fel: {$mail->ErrorInfo}";
        }
    } else {
        $message = "Ingen användare hittades med den adressen.";
    }
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Glömt lösenord</title>
    <style>
        body { font-family: sans-serif; background: #0f172a; color: white; text-align: center; padding-top: 50px; }
        form { background: #1e293b; display: inline-block; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
        input { display: block; margin: 10px auto; padding: 10px; width: 250px; border-radius: 4px; border: none; }
        button { background: #22c55e; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; transition: background 0.3s; }
        button:hover { background: #16a34a; }
    </style>
</head>
<body>
    <h2>Återställ lösenord</h2>
    <p><?php echo $message; ?></p>
    <form method="POST">
        <input type="email" name="email" placeholder="Skriv din e-postadress" required>
        <button type="submit">Skicka länk</button>
    </form>
</body>
</html>