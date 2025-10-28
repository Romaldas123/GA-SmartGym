<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Anslut till databasen
$conn = new mysqli("localhost", "root", "", "ga_project");

// Kontrollera anslutning
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Testa insättning om formulär skickats
if(isset($_POST['submit'])){
    $name = $_POST['name'];
    $comment = $_POST['comment'];

    $stmt = $conn->prepare("INSERT INTO users (name, comment) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $comment);
    $stmt->execute();
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Test Kommentarer</title>
</head>
<body>
    <h1>Skriv en kommentar</h1>
    <form action="index.php" method="post">
        Namn: <input type="text" name="name" required><br><br>
        Kommentar: <textarea name="comment" required></textarea><br><br>
        <input type="submit" name="submit" value="Skicka">
    </form>

    <h2>Kommentarer:</h2>
    <?php
    $result = $conn->query("SELECT * FROM users ORDER BY id DESC");
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            echo "<div><b>".htmlspecialchars($row['name'])."</b>: ".htmlspecialchars($row['comment'])."</div>";
        }
    } else {
        echo "<p>Inga kommentarer än.</p>";
    }
    ?>
</body>
</html>
