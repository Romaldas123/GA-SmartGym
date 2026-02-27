<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../../../Backend_Struktur/login.php");
    exit();
}

$user_name = $_SESSION['user_name'] ?? "Medlem";
$user_id = $_SESSION['user_id'] ?? "";

// Datum för hälsning
$hour = date('H');
if ($hour < 12) {
    $greeting = "Godmorgon";
} elseif ($hour < 18) {
    $greeting = "Godeftermiddag";
} else {
    $greeting = "Godkväll";
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GA SmartGym | Dashboard</title>

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">

    <!-- External CSS -->
    <link rel="stylesheet" href="struktur.css">
</head>
<body>

<!-- ===== NAVBAR ===== -->
<header class="navbar">
    <div class="logo">
        <div class="logo-box">GA</div>
        <div>
            <h2>GA SmartGym</h2>
            <p>Din träningsplattform</p>
        </div>
    </div>

    <nav>
        <a href="struktur.php" class="nav-link active">Hem</a>
        <a href="../schema/schema.php" class="nav-link">Schema</a>
        <a href="../Chatten/chatten.php" class="nav-link">AI Coach</a>
        <a href="../../../Backend_Struktur/fragor.php" class="nav-link">Frågor</a>
        <a href="../../../Backend_Struktur/logout.php" class="logout">Logga ut</a>
    </nav>

    <div class="user-info">
        <span class="user-name"><?php echo htmlspecialchars($user_name); ?></span>
    </div>
</header>

<!-- ===== HERO SECTION ===== -->
<section class="hero">
    <div class="hero-content">
        <div class="greeting-badge"><?php echo $greeting; ?>, <?php echo htmlspecialchars($user_name); ?> 👋</div>
        
        <h1>Välkommen tillbaka, <span><?php echo htmlspecialchars($user_name); ?></span> 💪</h1>
        
        <p>
            Optimera din träning med smart planering, AI-coach och tydlig progression.
            Allt samlat på ett ställe för maximal effektivitet och resultat.
        </p>

        <div class="hero-buttons">
            <a href="../schema/schema.php" class="btn-primary">
                <span class="btn-icon">📅</span>
                Öppna Schema
            </a>
            <a href="../Chatten/chatten.php" class="btn-secondary">
                <span class="btn-icon">🤖</span>
                Starta AI Coach
            </a>
        </div>

        <div class="hero-stats">
            <div class="stat">
                <span class="stat-number">7</span>
                <span class="stat-label">Träningspass denna vecka</span>
            </div>
            <div class="stat">
                <span class="stat-number">24</span>
                <span class="stat-label">Totala träningspass</span>
            </div>
            <div class="stat">
                <span class="stat-number">92%</span>
                <span class="stat-label">Genomförande</span>
            </div>
        </div>
    </div>

    <div class="hero-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
    </div>
</section>

<!-- ===== FEATURES SECTION ===== -->
<section class="features">

    <div class="feature-card" data-aos="fade-up">
        <div class="card-header">
            <div class="icon-box">📅</div>
            <span class="badge">Schema</span>
        </div>
        <h3>Veckoschema</h3>
        <p>Planera dina träningspass, strukturera veckan och maximera dina resultat genom smart tidplanering.</p>
        <div class="card-features">
            <span class="feature-item">✓ Veckoöversikt</span>
            <span class="feature-item">��� Anpassning</span>
            <span class="feature-item">✓ Påminnelser</span>
        </div>
        <a href="../schema/schema.php" class="card-btn">Gå till Schema</a>
    </div>

    <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
        <div class="card-header">
            <div class="icon-box">🤖</div>
            <span class="badge badge-ai">AI Coach</span>
        </div>
        <h3>AI Coach</h3>
        <p>Få personliga rekommendationer om träning, kost och återhämtning direkt från en intelligent coach.</p>
        <div class="card-features">
            <span class="feature-item">✓ Personlig råd</span>
            <span class="feature-item">✓ 24/7 Tillgänglig</span>
            <span class="feature-item">✓ Instant svar</span>
        </div>
        <a href="../Chatten/chatten.php" class="card-btn">Öppna Chatten</a>
    </div>

    <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
        <div class="card-header">
            <div class="icon-box">📈</div>
            <span class="badge badge-stats">Progression</span>
        </div>
        <h3>Progression & Statistik</h3>
        <p>Analysera dina prestationer och följ din utveckling över tid med detaljerade grafer och mätvärden.</p>
        <div class="card-features">
            <span class="feature-item">✓ Grafer</span>
            <span class="feature-item">✓ Mätvärden</span>
            <span class="feature-item">✓ Målsättning</span>
        </div>
        <a href="#" class="card-btn">Se Statistik</a>
    </div>

</section>

<!-- ===== QUICK ACCESS SECTION ===== -->
<section class="quick-access">
    <h2>Snabb åtkomst</h2>
    <p>Här är dina senaste aktiviteter</p>

    <div class="quick-cards">
        <div class="quick-card">
            <h4>Senaste träning</h4>
            <p class="time">Igår</p>
            <p class="activity">Bröst & Triceps</p>
            <span class="status">✓ Slutförd</span>
        </div>

        <div class="quick-card">
            <h4>Nästa träning</h4>
            <p class="time">Imorgon</p>
            <p class="activity">Rygg & Biceps</p>
            <span class="status">⏱ Planerad</span>
        </div>

        <div class="quick-card">
            <h4>AI Coach Tips</h4>
            <p class="time">Idag</p>
            <p class="activity">Drick mer vatten!</p>
            <span class="status">💡 Tips</span>
        </div>
    </div>
</section>

<!-- ===== CTA SECTION ===== -->
<section class="cta">
    <div class="cta-content">
        <h2>Redo att ta din träning till <span>nästa nivå</span>?</h2>
        <p>GA SmartGym hjälper dig att strukturera, analysera och förbättra varje träningspass med precision och expertis.</p>
        
        <div class="cta-buttons">
            <a href="../schema/schema.php" class="btn-primary large">
                Börja Nu
            </a>
            <a href="../Chatten/chatten.php" class="btn-secondary large">
                Prata med AI Coach
            </a>
        </div>
    </div>
</section>

<!-- ===== FOOTER ===== -->
<footer>
    <div class="footer-content">
        <div class="footer-section">
            <h4>GA SmartGym</h4>
            <p>Din kompletta träningsplattform med schema, AI-coach och analys.</p>
        </div>
        <div class="footer-section">
            <h4>Snabblänkar</h4>
            <ul>
                <li><a href="struktur.php">Hem</a></li>
                <li><a href="../schema/schema.php">Schema</a></li>
                <li><a href="../Chatten/chatten.php">AI Coach</a></li>
                <li><a href="../../../Backend_Struktur/logout.php">Logga ut</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h4>Kontakt</h4>
            <p>Email: support@gasmartgym.se</p>
            <p>Tel: +46 (0)8 1234 5678</p>
        </div>
    </div>

    <div class="footer-bottom">
        <p>&copy; 2026 GA SmartGym. Alla rättigheter förbehållna.</p>
        <div class="footer-links">
            <a href="#">Sekretesspolicy</a>
            <a href="#">Användarvillkor</a>
            <a href="#">Kontakt</a>
        </div>
    </div>
</footer>

</body>
</html>