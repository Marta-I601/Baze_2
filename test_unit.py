import unittest
from app import app

class TestRegistracija(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.tester = app.test_client()

    def test_prikaz_registracije(self):
        """Test da li se stranica za registraciju prikazuje"""
        response = self.tester.get("/registracija", content_type="html/text")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Registracija", response.data)

    def test_uspesna_registracija(self):
        """Test uspešne registracije korisnika"""
        data = {
            "username": "testkorisnik",
            "email": "test@example.com",
            "password": "lozinka123"
        }
        response = self.tester.post("/registracija", data=data, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Uspesno ste se registrovali", response.data)

    def test_neuspesna_registracija(self):
        """Test neuspešne registracije (npr. bez email-a)"""
        data = {
            "username": "testkorisnik2",
            "password": "lozinka123"
        }
        response = self.tester.post("/registracija", data=data, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Email je obavezan", response.data)


class TestForme(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.tester = app.test_client()

    def login(self):
        with self.tester.session_transaction() as sess:
            sess["loggedin"] = True
            sess["id"] = 1  # test user
            sess["uloga"] = 1

    def test_kreiranje_forme_prikaz(self):
        """Test prikaza stranice za kreiranje forme"""
        self.login()
        response = self.tester.get("/forme/kreiraj", content_type="html/text")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Kreiraj novu formu", response.data)

    def test_kreiranje_forme_post(self):
        """Test dodavanja nove forme"""
        self.login()
        data = {
            "naziv": "Test Forma",
            "opis": "Ovo je test forma",
            "dozvola": "svi"  # svi mogu popunjavati
        }
        response = self.tester.post("/forme/kreiraj", data=data, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Forma je uspesno kreirana", response.data)


if __name__ == "__main__":
    unittest.main()
