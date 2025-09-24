<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once("connect.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    //Malim slovom userId, naziv i opis jer su to nazivi polja u JSON koji se šalje Reactu, velikim su u bazi ne mešaj
    if (!isset($data["userId"]) || !isset($data["naziv"]) || !isset($data["opis"])) {
        echo json_encode(["success" => false, "message" => "Nedostaju podaci"]);
        exit;
    }

    $userId = $data["userId"];
    $naziv = $data["naziv"];
    $opis = $data["opis"];
    $allowAnonymous = isset($data["allowAnonymous"]) ? (int)$data["allowAnonymous"] : 0;

    $sql = "INSERT INTO forma (UserId, Naziv, Opis, AllowAnonymous, Locked, CreatedAt) 
            VALUES (?, ?, ?, ?, 0, NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issi", $userId, $naziv, $opis, $allowAnonymous);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "formId" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "message" => "Greška prilikom upisa"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Greška"]);
}