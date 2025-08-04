<?php
include 'connect.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// VAŽNO: Uklonjen echo koji pravi problem

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection not defined"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON format"]);
        exit;
    }

    if (isset($data->action) && $data->action === 'signUp') {
        if (!isset($data->username, $data->email, $data->password)) {
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            exit;
        }

        $username = $data->username;
        $email = $data->email;
        $password = $data->password;

        $checkEmail = "SELECT * FROM korisnik WHERE Email = ?";
        $stmt = $conn->prepare($checkEmail);
        $stmt->bind_param("s", $email);

        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "message" => "SQL Error: " . $stmt->error]);
            exit;
        }

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email address already exists!"]);
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $insertQuery = "INSERT INTO korisnik (username, Email, Šifra) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($insertQuery);
            $stmt->bind_param("sss", $username, $email, $hashedPassword);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "User registered successfully!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Database error occurred"]);
            }
        }
    } elseif (isset($data->action) && $data->action === 'signIn') {
        if (!isset($data->email, $data->password)) {
            echo json_encode(["success" => false, "message" => "Missing email or password"]);
            exit;
        }

        $email = $data->email;
        $password = $data->password;

        $sql = "SELECT * FROM korisnik WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);

        if ($stmt->execute()) {
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if (password_verify($password, $row['password'])) {
                    session_start();
                    $_SESSION['email'] = $row['email'];
                    echo json_encode(["success" => true, "message" => "Login successful"]);
                } else {
                    echo json_encode(["success" => false, "message" => "Incorrect password"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "Email not found"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "SQL Error: " . $stmt->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }
}
?>