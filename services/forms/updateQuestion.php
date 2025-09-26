<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS, DELETE");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once("connect.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Nije prosleđen ID pitanja"]);
    exit;
}

$id = (int)$data['id'];
$text = $data['text'] ?? '';
$type = $data['type'] ?? '';
$obavezno = isset($data['obavezno']) ? (int)$data['obavezno'] : 0;
$redosled = $data['redosled'] ?? null;

// Za numerička pitanja
$numericType = $data['numericType'] ?? null;
$start = isset($data['start']) ? (float)$data['start'] : null;
$end = isset($data['end']) ? (float)$data['end'] : null;
$step = isset($data['step']) ? (float)$data['step'] : 1;

// Za više od odabranih
$minSelections = isset($data['minSelections']) ? (int)$data['minSelections'] : null;

// UPDATE pitanje
$sql = "UPDATE pitanje SET Tekst=?, Tip=?, Obavezno=?, MinSelections=?";
$params = [$text, $type, $obavezno, $minSelections];
$types = "ssii";

if ($redosled !== null) {
    $sql .= ", Redosled=?";
    $params[] = $redosled;
    $types .= "i";
}

$sql .= " WHERE Id=?";
$params[] = $id;
$types .= "i";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Greška prilikom izmene: ".$stmt->error]);
    exit;
}

// Brisanje i dodavanje opcija za pitanja sa izborom i numerička pitanja
if ($type === "jedan_od_odabranih" || $type === "vise_od_odabranih" || $type === "numericki") {
    $stmt2 = $conn->prepare("DELETE FROM opcija WHERE PitanjeId=?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();
    $stmt2->close();

    $options = [];

    // Opcije za numeričko pitanje
    if ($type === "numericki" && $numericType && $start !== null && $end !== null) {
        if ($numericType === "lista") {
            for ($i = $start; $i <= $end; $i++) {
                $options[] = (string)$i;
            }
        } elseif ($numericType === "skala") {
            if ($step <= 0) $step = 1;
            for ($i = $start; $i <= $end; $i += $step) {
                $options[] = (string)$i;
            }
        }
    }

    // Opcije iz frontenda
    if (($type === "jedan_od_odabranih" || $type === "vise_od_odabranih") && isset($data['options'])) {
        $options = $data['options'];
    }

    foreach ($options as $opt) {
        $stmt3 = $conn->prepare("INSERT INTO opcija (PitanjeId, Tekst) VALUES (?, ?)");
        $stmt3->bind_param("is", $id, $opt);
        $stmt3->execute();
        $stmt3->close();
    }
}

echo json_encode(["success" => true, "message" => "Pitanje izmenjeno"]);

$stmt->close();
$conn->close();
