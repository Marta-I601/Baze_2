<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

include_once("connect.php");

if (!isset($_GET['userId'])) {
    echo json_encode(["success" => false, "message" => "Nedostaje userId"]);
    exit;
}

$userId = (int)$_GET['userId'];

$sql = "SELECT Id, Naziv, Opis, AllowAnonymous FROM forma WHERE UserId = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$forms = [];
while ($row = $result->fetch_assoc()) {
    $forms[] = [
        "id" => $row['Id'],
        "naziv" => $row['Naziv'],
        "opis" => $row['Opis'],
        "allowAnonymous" => (int)$row['AllowAnonymous'],
        "thumbnail" => null
    ];
}

echo json_encode(["success" => true, "forms" => $forms]);
?>
