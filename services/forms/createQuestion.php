<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once("connect.php"); // koristiš svoj connect.php

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
    echo json_encode(["success" => false, "message" => "Nema podataka"]);
    exit;
}

// Validacija minimalnih polja
if(empty($data['formId']) || empty($data['text']) || empty($data['type'])) {
    echo json_encode(["success" => false, "message" => "Nedostaju obavezna polja"]);
    exit;
}

$formId = (int)$data['formId'];
$text = $data['text'];
$type = $data['type'];
$obavezno = isset($data['obavezno']) ? (bool)$data['obavezno'] : false;
$obaveznoInt = $obavezno ? 1 : 0;
$options = isset($data['options']) ? json_encode($data['options']) : null;
$redosled = isset($data['redosled']) ? (int)$data['redosled'] : 0;

// Za numerički tip
$numericType = isset($data['numericType']) ? $data['numericType'] : null;
$start = isset($data['start']) ? (float)$data['start'] : null;
$end = isset($data['end']) ? (float)$data['end'] : null;
$step = isset($data['step']) ? (float)$data['step'] : 1;

// Za više od odabranih
$requireMinSelections = isset($data['requireMinSelections']) ? (bool)$data['requireMinSelections'] : false;
$minSelections = ($requireMinSelections && isset($data['minSelections'])) ? (int)$data['minSelections'] : null;

// Ubacivanje pitanja u bazu
$sql = "INSERT INTO pitanje (FormaId, Tekst, Tip, Obavezno, Redosled, MinSelections) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("issiii", $formId, $text, $type, $obaveznoInt, $redosled, $minSelections);

if($stmt->execute()) {
    $questionId = $stmt->insert_id;

    if ($options) {
        $optionsArray = json_decode($options, true);
        $sqlOptions = "INSERT INTO opcija (PitanjeId, Tekst) VALUES (?, ?)";
        $stmtOpt = $conn->prepare($sqlOptions);
        foreach ($optionsArray as $opt) {
            $stmtOpt->bind_param("is", $questionId, $opt);
            $stmtOpt->execute();
        }
        $stmtOpt->close();
    }

    // Ako je numerički tip ovako generišem opcije
    if ($type === "numericki" && $numericType && $start !== null && $end !== null) {
        $numbers = [];
        if ($numericType === "lista") {
            for ($i = $start; $i <= $end; $i++) {
                $numbers[] = $i;
            }
        } elseif ($numericType === "skala") {
            if ($step <= 0) $step = 1; // da ne pravi beskonačnu petlju
            for ($i = $start; $i <= $end; $i += $step) {
                $numbers[] = $i;
            }
        }

        if (!empty($numbers)) {
            $sqlOptions = "INSERT INTO opcija (PitanjeId, Tekst) VALUES (?, ?)";
            $stmtOpt = $conn->prepare($sqlOptions);
            foreach ($numbers as $num) {
                $numStr = (string)$num;
                $stmtOpt->bind_param("is", $questionId, $numStr);
                $stmtOpt->execute();
            }
            $stmtOpt->close();
        }
    }

    echo json_encode(["success" => true, "message" => "Pitanje uspešno dodato", "questionId" => $questionId]);
} else {
    echo json_encode(["success" => false, "message" => "Greška prilikom upisa pitanja"]);
}

$stmt->close();
$conn->close();
