<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

include 'connect.php';

$data = json_decode(file_get_contents("php://input"));

// Provera da li su poslati svi podaci
if (!isset($data->id, $data->Rola)) {
    echo json_encode(["success" => false, "message" => "Nisu poslati svi podaci"]);
    exit;
}

// Provera da li je Rola validna vrednost (0 ili 1)
if (!in_array($data->Rola, [0, 1], true)) {
    echo json_encode(["success" => false, "message" => "Nevalidna vrednost za Rolu"]);
    exit;
}

$stmt = $conn->prepare("UPDATE korisnik SET Rola = ? WHERE Id = ?");
$stmt->bind_param("ii", $data->Rola, $data->id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Korisnik uspešno izmenjen"]);
} else {
    echo json_encode(["success" => false, "message" => "Greška prilikom izmene"]);
}
?>