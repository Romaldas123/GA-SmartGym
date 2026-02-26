<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

header('Content-Type: application/json');

// Sätt en test-user om ingen är inloggad
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; 
}

// Skapa databasanslutning
$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Funktion för checkboxar / array-data
function getPostArray($key) {
    if (isset($_POST[$key])) {
        if (is_array($_POST[$key])) {
            return json_encode($_POST[$key]);
        } else {
            return json_encode([$_POST[$key]]);
        }
    }
    return json_encode([]);
}

// Hämta POST-data
$user_id = $_SESSION['user_id'];
$age = isset($_POST['age']) && $_POST['age'] !== "" ? (int)$_POST['age'] : 0;
$weight = isset($_POST['weight']) && $_POST['weight'] !== "" ? (int)$_POST['weight'] : 0;
$gender = $_POST['gender'] ?? "";
$lifestyle = $_POST['lifestyle'] ?? "";
$availability = getPostArray('availability');
$main_goal = getPostArray('main_goal');
$experience_level = $_POST['experience_level'] ?? "";
$experience_details = $_POST['experience_details'] ?? "";
$health_status = $_POST['health_status'] ?? "";
$health_details = $_POST['health_details'] ?? "";
$goal_details = $_POST['goal_details'] ?? "";

// Förbered SQL-sats
$stmt = $conn->prepare("INSERT INTO user_answers 
    (user_id, age, weight, gender, lifestyle, availability, experience_level, experience_details, health_status, health_details, main_goal, goal_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "SQL prepare failed: " . $conn->error]);
    exit;
}

// Bind parametrar
$stmt->bind_param(
    "iissssssssss",
    $user_id,
    $age,
    $weight,
    $gender,
    $lifestyle,
    $availability,
    $experience_level,
    $experience_details,
    $health_status,
    $health_details,
    $main_goal,
    $goal_details
);


// Kör SQL
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Svar sparade!"]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error,
        "post_data" => $_POST,
        "availability" => $_POST['availability'] ?? null,
        "main_goal" => $_POST['main_goal'] ?? null
    ]);
}

// Stäng anslutningar
$stmt->close();
$conn->close();
?>
