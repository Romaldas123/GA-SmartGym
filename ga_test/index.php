<?php
// Visa eventuella fel (bra för test)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Databasanslutning
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    die("Kunde inte ansluta till databasen: " . $conn->connect_error);
}

// Spara kommentar om formuläret skickas
if (isset($_POST['submit'])) {
    $name = $_POST['name'];
    $comment = $_POST['comment'];

    if (!empty($name) && !empty($comment)) {
        $stmt = $conn->prepare("INSERT INTO users (name, comment) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $comment);
        $stmt->execute();
        $stmt->close();
    } else {
        echo "<p style='color:red;'>Vänligen fyll i både namn och kommentar!</p>";
    }
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>SmartGym Kommentarer</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>💬 SmartGym Kommentarer</h1>

    <div class="container">
        <form method="POST" action="index.php">
            <label for="name">Namn:</label>
            <input type="text" id="name" name="name" required>

            <label for="comment">Kommentar:</label>
            <textarea id="comment" name="comment" required></textarea>

            <input type="submit" name="submit" value="Skicka kommentar">
        </form>
    </div>

    <div class="container">
        <h2>Senaste kommentarer:</h2>
        <?php
        $result = $conn->query("SELECT * FROM users ORDER BY id DESC");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<div class='comment'><b>" . htmlspecialchars($row['name']) . "</b>: " . htmlspecialchars($row['comment']) . "</div>";
            }
        } else {
            echo "<p>Inga kommentarer ännu.</p>";
        }
        ?>
    </div>
</body>
</html>
