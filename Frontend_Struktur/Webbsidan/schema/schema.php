<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../../Backend_Struktur/login.php");
    exit();
}

$user_name = $_SESSION['user_name'] ?? "Medlem";

// Schema data
$workouts = [
    "Måndag" => [
        "title" => "Bröst & Triceps",
        "emoji" => "💪",
        "exercises" => [
            ["name" => "Bänkpress", "sets" => "4x8", "intensity" => "Hög"],
            ["name" => "Lutande bänkpress", "sets" => "3x10", "intensity" => "Medel"],
            ["name" => "Dips", "sets" => "3x8", "intensity" => "Hög"],
            ["name" => "Triceps Pushdowns", "sets" => "3x12", "intensity" => "Medel"],
            ["name" => "Fluguppgång", "sets" => "3x10", "intensity" => "Låg"]
        ],
        "duration" => "60 min",
        "difficulty" => "Hög"
    ],
    "Tisdag" => [
        "title" => "Rygg & Biceps",
        "emoji" => "🔙",
        "exercises" => [
            ["name" => "Marklyft", "sets" => "4x5", "intensity" => "Mycket hög"],
            ["name" => "Pullups", "sets" => "4x8", "intensity" => "Hög"],
            ["name" => "Barbellrow", "sets" => "4x8", "intensity" => "Hög"],
            ["name" => "Biceps Curls", "sets" => "3x10", "intensity" => "Medel"],
            ["name" => "Face Pulls", "sets" => "3x15", "intensity" => "Låg"]
        ],
        "duration" => "70 min",
        "difficulty" => "Mycket hög"
    ],
    "Onsdag" => [
        "title" => "Vila eller lätt Cardio",
        "emoji" => "🧘",
        "exercises" => [
            ["name" => "Jogging eller cykling", "sets" => "20-30 min", "intensity" => "Låg"],
            ["name" => "Stretching", "sets" => "10 min", "intensity" => "Låg"],
            ["name" => "Yoga", "sets" => "Optional", "intensity" => "Låg"]
        ],
        "duration" => "30-40 min",
        "difficulty" => "Låg"
    ],
    "Torsdag" => [
        "title" => "Ben",
        "emoji" => "🦵",
        "exercises" => [
            ["name" => "Squats", "sets" => "4x6", "intensity" => "Mycket hög"],
            ["name" => "Benpress", "sets" => "4x8", "intensity" => "Hög"],
            ["name" => "Utfall", "sets" => "3x10", "intensity" => "Medel"],
            ["name" => "Leg Curls", "sets" => "3x12", "intensity" => "Medel"],
            ["name" => "Calf Raises", "sets" => "3x15", "intensity" => "Låg"]
        ],
        "duration" => "75 min",
        "difficulty" => "Mycket hög"
    ],
    "Fredag" => [
        "title" => "Axlar & Core",
        "emoji" => "💥",
        "exercises" => [
            ["name" => "Militärpress", "sets" => "4x8", "intensity" => "Hög"],
            ["name" => "Lateral Raises", "sets" => "3x12", "intensity" => "Medel"],
            ["name" => "Plankan", "sets" => "3x60s", "intensity" => "Medel"],
            ["name" => "Pallid Raises", "sets" => "3x12", "intensity" => "Medel"],
            ["name" => "Ab Wheel", "sets" => "3x10", "intensity" => "Hög"]
        ],
        "duration" => "60 min",
        "difficulty" => "Hög"
    ],
    "Lördag" => [
        "title" => "Aktivt Vila",
        "emoji" => "🚴",
        "exercises" => [
            ["name" => "Promenad", "sets" => "45 min", "intensity" => "Låg"],
            ["name" => "Lätt stretching", "sets" => "15 min", "intensity" => "Låg"]
        ],
        "duration" => "60 min",
        "difficulty" => "Låg"
    ],
    "Söndag" => [
        "title" => "Vilodag",
        "emoji" => "😴",
        "exercises" => [
            ["name" => "Fullständig vila", "sets" => "Hela dagen", "intensity" => "Ingen"]
        ],
        "duration" => "0 min",
        "difficulty" => "Ingen"
    ]
];
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GA SmartGym - Veckoschema</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">

    <!-- CSS -->
    <link rel="stylesheet" href="schema.css?v=1.0">
</head>
<body>

<!-- ===== NAVIGATION ===== -->
<header class="navbar">
    <div class="logo">
        <div class="logo-box">GA</div>
        <div>
            <h2>GA SmartGym</h2>
            <p>Veckoschema</p>
        </div>
    </div>

    <nav>
        <a href="../struktur/struktur.php">Hem</a>
        <a href="schema.php" class="active">Schema</a>
        <a href="../Chatten/chatten.php">AI Coach</a>
        <a href="../../Backend_Struktur/fragor.php">Frågor</a>
        <a href="../../Backend_Struktur/logout.php" class="logout">Logga ut</a>
    </nav>
</header>

<!-- ===== HERO ===== -->
<section class="schema-hero">
    <h1>📅 Din Veckoschema</h1>
    <p>Planera din träning vecka för vecka och nå dina mål</p>
</section>

<!-- ===== MAIN CONTENT ===== -->
<main class="schema-container">

    <!-- Days Navigation -->
    <div class="days-wrapper">
        <div class="days">
            <?php foreach (array_keys($workouts) as $index => $day): ?>
                <button class="day-btn <?php echo $index === 0 ? 'active' : ''; ?>" data-day="<?php echo $day; ?>">
                    <span class="day-number"><?php echo $index + 1; ?></span>
                    <span class="day-name"><?php echo $day; ?></span>
                </button>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Workout Content -->
    <div id="dayContent" class="day-content">
        <!-- Content loaded by JavaScript -->
    </div>

</main>

<!-- ===== FOOTER ===== -->
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h4>GA SmartGym</h4>
            <p>Din kompletta träningsplattform</p>
        </div>
        <div class="footer-section">
            <h4>Snabblänkar</h4>
            <ul>
                <li><a href="../struktur/struktur.php">Hem</a></li>
                <li><a href="schema.php">Schema</a></li>
                <li><a href="../Chatten/chatten.php">AI Coach</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 GA SmartGym. Alla rättigheter förbehållna.</p>
    </div>
</footer>

<!-- ===== JAVASCRIPT ===== -->
<script src="schema.js"></script>

</body>
</html>