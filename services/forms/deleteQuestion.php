<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Content-Type: application/json");

// OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once("connect.php");

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "Nije prosleđen ID pitanja"]);
    exit;
}

$questionId = (int)$_GET['id'];

// U BAZI JE PODEŠENO CASCADE, BRIŠE I OPCIJE PITANJA
$sql = "DELETE FROM pitanje WHERE Id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $questionId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Pitanje obrisano"]);
} else {
    echo json_encode(["success" => false, "message" => "Greška prilikom brisanja"]);
}

$stmt->close();
$conn->close();
