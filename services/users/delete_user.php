<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'connect.php'; // veza sa bazom

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->id)) {
        echo json_encode(["success" => false, "message" => "ID nije poslat"]);
        exit;
    }

    $id = $data->id;

    $stmt = $conn->prepare("DELETE FROM korisnik WHERE Id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Korisnik obrisan"]);
    } else {
        echo json_encode(["success" => false, "message" => "Greška prilikom brisanja"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Nevalidan zahtev"]);
}
?>
