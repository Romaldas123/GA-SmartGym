<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../../../Backend_Struktur/login.php");
    exit();
}

$user_name = $_SESSION['user_name'] ?? "Medlem";
?>

<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GA SmartGym | Dashboard</title>

<!-- VIKTIGT: CSS från samma mapp -->
<link rel="stylesheet" href="struktur.css">

</head>
<body>

<header class="navbar">
    <div class="logo">GA SmartGym</div>
    <nav>
        <a href="struktur.php" class="active">Hem</a>
        <a href="../schema/schema.php">Schema</a>
        <a href="../Chatten/chatten.php">AI Coach</a>
        <a href="../../../Backend_Struktur/fragor.php">Frågor</a>
        <a href="../../../Backend_Struktur/logout.php" class="logout">Logga ut</a>
    </nav>
</header>

<section class="hero">
    <div class="hero-content">
        <h1>Välkommen tillbaka, <?php echo htmlspecialchars($user_name); ?> 💪</h1>
        <p>Din smarta träningsplattform för schema, AI-coach och progression.</p>
        <div class="buttons">
            <a href="../schema/schema.php" class="btn primary">Öppna Schema</a>
            <a href="../Chatten/chatten.php" class="btn secondary">Starta AI Coach</a>
        </div>
    </div>
</section>

<section class="cards">
    <div class="card">
        <h2>📅 Veckoschema</h2>
        <p>Planera din vecka och håll koll på dina träningspass.</p>
        <a href="../schema/schema.php">Gå till Schema</a>
    </div>

    <div class="card">
        <h2>🤖 AI Coach</h2>
        <p>Få personliga råd om träning och kost direkt i chatten.</p>
        <a href="../Chatten/chatten.php">Öppna Chatten</a>
    </div>

    <div class="card">
        <h2>📈 Progression</h2>
        <p>Följ dina resultat och nå dina mål snabbare.</p>
        <a href="#">Se Statistik</a>
    </div>
</section>

<footer>
    © 2026 GA SmartGym. Alla rättigheter förbehållna.
</footer>

</body>
</html>