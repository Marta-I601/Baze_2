<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include 'connect.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Provera konekcije
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

    // REGISTRACIJA
    if (isset($data->action) && $data->action === 'signUp') {
        if (!isset($data->username, $data->email, $data->password)) {
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            exit;
        }

        $username = $data->username;
        $email = $data->email;
        $password = $data->password; // Lozinka ostaje neheširana

        if (strlen($password) < 8) {
            echo json_encode(["success" => false, "message" => "Password must be at least 8 characters long"]);
            exit;
        }
        if (!preg_match('/[A-Z]/', $password)) {
            echo json_encode(["success" => false, "message" => "Password must contain at least one uppercase letter"]);
            exit;
        }
        if (!preg_match('/[a-z]/', $password)) {
            echo json_encode(["success" => false, "message" => "Password must contain at least one lowercase letter"]);
            exit;
        }
        if (!preg_match('/[0-9]/', $password)) {
            echo json_encode(["success" => false, "message" => "Password must contain at least one number"]);
            exit;
        }
        if (!preg_match('/[\W]/', $password)) {
            echo json_encode(["success" => false, "message" => "Password must contain at least one special character"]);
            exit;
        }
        // PROVERA DA L EMAIL POSTOJI
        $checkEmail = "SELECT * FROM korisnik WHERE Email = ?";
        $stmt = $conn->prepare($checkEmail);
        if (!$stmt) { 
            echo json_encode(["success" => false, "message" => "SQL Prepare Error: " . $conn->error]);
            exit;
        }
        $stmt->bind_param("s", $email);
        if (!$stmt->execute()) { 
            echo json_encode(["success" => false, "message" => "SQL Execute Error: " . $stmt->error]);
            exit;
        }
        
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email address already exists!"]);
            exit;
        } else {
            $insertQuery = "INSERT INTO korisnik (Username, Email, Šifra, Rola) VALUES (?, ?, ?, 1)";
            $stmt = $conn->prepare($insertQuery);
            if (!$stmt) { 
                echo json_encode(["success" => false, "message" => "SQL Prepare Error: " . $conn->error]);
                exit;
            }
            $stmt->bind_param("sss", $username, $email, $password);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "User registered successfully!"]);
                exit;
            } else {
                echo json_encode(["success" => false, "message" => "Database error occurred"]);
                exit;
            }
        }
    } 
    
    // LOGIN
    elseif (isset($data->action) && $data->action === 'signIn') {
        if (!isset($data->email, $data->password)) {
            echo json_encode(["success" => false, "message" => "Missing email or password"]);
            exit;
        }

        $email = $data->email;
        $password = $data->password;

        // Pronalazimo korisnika po emailu
        $sql = "SELECT * FROM korisnik WHERE Email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "message" => "SQL Error: " . $stmt->error]);
            exit;
        }

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            // **Sada samo upoređujemo običan string, bez `password_verify()`**
            if ($password === $row['Šifra']) {
                session_start();
                $_SESSION['email'] = $row['Email'];
                $_SESSION['username'] = $row['Username'];
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "username" => $row['Username'],
                    "Rola" => (int)$row['Rola']   // sve ide u jedan niz
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Incorrect password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Email not found"]);
        }
    } 
    
    // Ako akcija nije validna
    else {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }
}
?>