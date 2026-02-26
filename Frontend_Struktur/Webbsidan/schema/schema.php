<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../../Backend_Struktur/login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>GA SmartGym - Schema</title>
    <link rel="stylesheet" href="../Header/header.css">
    <link rel="stylesheet" href="schema.css">
    <link rel="stylesheet" href="../footer/footer.css">
</head>
<body>

<?php include '../Header/header.html'; ?>

<main class="schema-container">
    <h1>Veckoschema</h1>

    <div class="days">
        <button class="day-btn" data-day="Måndag">Måndag</button>
        <button class="day-btn" data-day="Tisdag">Tisdag</button>
        <button class="day-btn" data-day="Onsdag">Onsdag</button>
        <button class="day-btn" data-day="Torsdag">Torsdag</button>
        <button class="day-btn" data-day="Fredag">Fredag</button>
    </div>

    <div id="dayContent" class="day-content">
        Välj en dag för att se träningspass.
    </div>
</main>

<?php include '../footer/footer.html'; ?>

<script src="../Header/header.js"></script>
<script src="schema.js"></script>
<script src="../footer/footer.js"></script>
</body>
</html>