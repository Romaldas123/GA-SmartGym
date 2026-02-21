<?php
session_start(); // Viktigt för att kunna använda sessioner
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

<main>
    <h1>Schema</h1>
    <p>Här kan användarens träningsschema visas.</p>

    <!-- Snabbknappar eller sektioner kan läggas till här -->
    <div class="quick-links">
        <a href="#" class="nav-link">Måndag</a>
        <a href="#" class="nav-link">Tisdag</a>
        <a href="#" class="nav-link">Onsdag</a>
    </div>
</main>

<?php include '../footer/footer.html'; ?>

<script src="../Header/header.js"></script>
<script src="schema.js"></script>
<script src="../footer/footer.js"></script>

</body>
</html>
