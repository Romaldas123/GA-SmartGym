<?php
header("Content-Type: application/json");

// Koppla till databasen
$conn = new mysqli("localhost", "root", "", "ga_project");

// Kolla om det fungerar
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Hämta alla rader från tabellen users
$sql = "SELECT id, name FROM users";
$result = $conn->query($sql);

$users = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);
$conn->close();
?>
