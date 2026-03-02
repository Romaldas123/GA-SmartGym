<?php
// Stoppa alla felmeddelanden från att skrivas ut som text (detta tar bort localhost-rutan)
error_reporting(0);
ini_set('display_errors', 0);

// Starta buffring för att kunna rensa bort oväntade mellanslag
ob_start();
session_start();

header('Content-Type: application/json; charset=utf-8');

// Databasanslutning
$conn = new mysqli("localhost", "root", "", "ga_project");

if ($conn->connect_error) {
    ob_clean();
    echo json_encode(["status" => "error", "message" => "DB-anslutning misslyckades"]);
    exit;
}

// Tvinga UTF-8 för ÅÄÖ
$conn->set_charset("utf8mb4");

$user_id = $_SESSION['user_id'] ?? 1;

// Funktion för att hantera arrayer (checkboxar) till JSON-strängar för DB
function getPostArray($key) {
    if (isset($_POST[$key])) {
        $data = is_array($_POST[$key]) ? $_POST[$key] : [$_POST[$key]];
        return json_encode($data, JSON_UNESCAPED_UNICODE);
    }
    return json_encode([]);
}

// Hämta och sanera data
$age = (int)($_POST['age'] ?? 0);
$weight = (int)($_POST['weight'] ?? 0);
$gender = $_POST['gender'] ?? "";
$lifestyle = $_POST['lifestyle'] ?? "";
$availability = getPostArray('availability');
$experience_level = $_POST['experience_level'] ?? "";
$experience_details = $_POST['experience_details'] ?? "";
$health_status = $_POST['health_status'] ?? "";
$health_details = $_POST['health_details'] ?? "";
$main_goal = getPostArray('main_goal');
$goal_details = $_POST['goal_details'] ?? "";

// SQL-fråga
$stmt = $conn->prepare("INSERT INTO user_answers 
    (user_id, age, weight, gender, lifestyle, availability, experience_level, experience_details, health_status, health_details, main_goal, goal_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if ($stmt) {
    $stmt->bind_param("iissssssssss", 
        $user_id, $age, $weight, $gender, $lifestyle, $availability, 
        $experience_level, $experience_details, $health_status, $health_details, 
        $main_goal, $goal_details
    );
    
    // Rensa utskrifts-bufferten precis innan vi svarar
    ob_clean();
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();
} else {
    ob_clean();
    echo json_encode(["status" => "error", "message" => "Prepare failed"]);
}

$conn->close();
exit;