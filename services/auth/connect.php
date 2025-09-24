<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
$host = "localhost";
$user = "root";
$pass = "";
$db = "probna";

// Kreiranje konekcije
$conn = new mysqli($host, $user, $pass, $db);

// Provera konekcije
if ($conn->connect_error) {
    die("Neuspelo konektovanje: " . $conn->connect_error);
}
?>