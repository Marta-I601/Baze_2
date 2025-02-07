<?php
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

        // Proveri da li email već postoji
        $checkEmail = "SELECT * FROM probna WHERE email = ?";
        $stmt = $conn->prepare($checkEmail);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email address already exists!"]);
        } else {
            // Lozinku čuvamo direktno u bazi (NE PREPORUČUJE SE!)
            $insertQuery = "INSERT INTO probna (username, email, password) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($insertQuery);
            $stmt->bind_param("sss", $username, $email, $password);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "User registered successfully!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Database error occurred"]);
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
        $sql = "SELECT * FROM probna WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            // **Sada samo upoređujemo običan string, bez `password_verify()`**
            if ($password === $row['password']) {
                session_start();
                $_SESSION['email'] = $row['email'];
                echo json_encode(["success" => true, "message" => "Login successful"]);
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
