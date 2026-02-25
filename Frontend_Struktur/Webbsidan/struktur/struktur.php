<?php
session_start();
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

<main class="main-container">
    <h1>Välkommen, <?php echo htmlspecialchars($user_name); ?>!</h1>

    <div class="quick-links">
        <a href="../schema/schema.php" class="nav-link">Schema</a>
        <a href="../Chatten/chatten.php" class="nav-link">Chatten</a>
    </div>

    <p>Här kan du se ditt träningsschema, chatta med AI-coachen och mycket mer.</p>
</main>

<?php include '../footer/footer.html'; ?>

<script src="../Header/header.js"></script>
<script src="struktur.js"></script>
<script src="../footer/footer.js"></script>
</body>
</html>