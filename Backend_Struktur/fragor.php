<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: text/plain");

ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; 
}

$conn = new mysqli("localhost", "root", "", "ga_project");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

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

$stmt = $conn->prepare("INSERT INTO user_answers 
    (user_id, age, weight, gender, lifestyle, availability, experience_level, experience_details, health_status, health_details, main_goal, goal_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "SQL prepare failed: " . $conn->error]);
    exit;
}

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

$stmt->close();
$conn->close();
?>
