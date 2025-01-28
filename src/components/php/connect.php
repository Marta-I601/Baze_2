<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Omogućava zahteve sa različitih domena
$host = "localhost";
$user = "root";
$pass = "";
$db = "proba";

// Kreiranje konekcije
$conn = new mysqli($host, $user, $pass, $db);

// Provera konekcije
if ($conn->connect_error) {
    die("Neuspelo konektovanje: " . $conn->connect_error);
}
?>