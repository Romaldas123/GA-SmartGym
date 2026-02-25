<?php
session_start();

// Om användaren inte är inloggad → skicka till login
if (!isset($_SESSION['user_id'])) {
    header("Location: ../../../../Backend_Struktur/login.php");
    exit();
}

$user_name = $_SESSION['user_name'];
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>GA SmartGym - Startsida</title>
    <link rel="stylesheet" href="../Header/header.css">
    <link rel="stylesheet" href="struktur.css">
    <link rel="stylesheet" href="../footer/footer.css">
</head>
<body>

<?php include '../Header/header.html'; ?>

<!-- HERO SECTION -->
<section class="hero">
    <div class="hero-content">
        <h1>Välkommen till GA SmartGym, <?php echo htmlspecialchars($user_name); ?>!</h1>
        <p>Din träningsresa börjar här. Se schema, chatta med AI-coach och nå dina mål!</p>
        <div class="hero-buttons">
            <a href="../schema/schema.php" class="btn-primary">Se Schema</a>
            <a href="../Chatten/chatten.php" class="btn-secondary">Chatta med AI</a>
        </div>
    </div>
</section>

<!-- FEATURE SECTION -->
<section class="features">
    <div class="feature">
        <h2>Veckoschema</h2>
        <p>Få full kontroll över dina träningspass och planera veckan smart.</p>
        <a href="../schema/schema.php" class="btn-feature">Gå till Schema</a>
    </div>
    <div class="feature">
        <h2>AI Coach</h2>
        <p>Chatta med vår AI-assistent och få råd om träning, kost och motivation.</p>
        <a href="../Chatten/chatten.php" class="btn-feature">Öppna Chatten</a>
    </div>
    <div class="feature">
        <h2>Progression</h2>
        <p>Följ din utveckling och se statistik över dina pass och framsteg.</p>
        <a href="#" class="btn-feature">Se Statistik</a>
    </div>
</section>

<?php include '../footer/footer.html'; ?>

<script src="../Header/header.js"></script>
<script src="struktur.js"></script>
<script src="../footer/footer.js"></script>
</body>
</html>