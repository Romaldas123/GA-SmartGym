<?php
session_start(); // Viktigt för sessionen från login.php
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>GA SmartGym - Hem</title>

    <!-- Header CSS -->
    <link rel="stylesheet" href="../Header/header.css">

    <!-- Startsidan CSS -->
    <link rel="stylesheet" href="struktur.css">

    <!-- Footer CSS -->
    <link rel="stylesheet" href="../footer/footer.css">
</head>
<body>

<!-- HEADER -->
<?php include '../Header/header.html'; ?>

<!-- MAIN CONTENT -->
<main>
    <h1>Välkommen till GA SmartGym!</h1>
    <p>Hej, <?php echo $_SESSION['user_name'] ?? "Gäst"; ?>!</p>
    <p>Här börjar vi bygga startsidan efter inloggning.</p>

    <!-- Exempel på snabbknappar -->
    <div class="quick-links">
        <a href="../schema/schema.php" class="nav-link">Schema</a>
        <a href="../Chatten/chatten.php" class="nav-link">Chat (AI)</a>
        <a href="../fragor/fragor.php" class="nav-link">Frågor</a>
    </div>
</main>

<!-- FOOTER -->
<?php include '../footer/footer.html'; ?>

<!-- HEADER JS -->
<script src="../Header/header.js"></script>

<!-- Startsidan JS -->
<script src="struktur.js"></script>

<!-- Footer JS -->
<script src="../footer/footer.js"></script>

</body>
</html>
