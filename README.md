Datum: 26.09.2025.  
Projektovanje informacionih sistema i baza podataka  

Opis projekta
FormApp je web aplikacija za kreiranje i upravljanje formularima, najsličnija Google Forms servisu.  
Dozvoljava korisnicima da kreiraju forme, definišu pitanja različitih tipova i dele ih sa drugima, dok se svi podaci trajno čuvaju u bazi.  

Aplikacija je razvijena kao mikroservisna arhitektura, sa frontend, backend i bazom podataka kao odvojenim servisima, kontejnerizovanim pomoću Docker-a i ispraćena sa CI [CI = Continuous Integration (kontinuirana integracija)].  




Funkcionalnosti
Registracija i prijava korisnika
- Sistem registracije korisnika sa obaveznom prijavom za kreiranje i popunjavanje nekih formi.  
- Samo prijavljeni korisnici mogu kreirati formu; neke forme mogu biti popunjene i anonimno (ako je dozvoljeno).  

Kreiranje i upravljanje formama
- Definisanje imena i opisa forme
- Podešavanje vidljivosti forme za neprijavljene korisnike
- Dodavanje različitih tipova pitanja:
- Kratak tekstualni odgovor (do 512 karaktera)
- Dug tekstualni odgovor (do 4096 karaktera)
- Više ponuđenih odgovora (jedan ili više izbor)
- Numerički odgovori (lista brojeva ili skala)
- Datum i vreme  
- Dodavanje slike u pitanje ili odgovor
- Mogućnost kloniranja, izmene, brisanja i promene redosleda pitanja
- Upravljanje kolaboratorima (urednici i posmatrači)
- Zaključavanje forme tako da nije moguće popunjavanje

Pregled i izvoz rezultata
Pregled pojedinačnih i grupnih odgovora.  
  
Tehnička arhitektura
-Frontend: React 
-Backend: PHP 
-Baza podataka: MySQL
-Kontejnerizacija: Docker  
-CI: Automatizovana kontinualna integracija servisa  
-Testiranje: Unit i integracioni testovi

Tok izvršavanja aplikacije
1. Korisnik pokreće aplikaciju lokalno ili putem Docker kontejnera.  
2. Prijava ili registracija korisnika.  
3. Kreiranje ili popunjavanje forme.  
4. Backend obrađuje zahteve i komunicira sa bazom podataka.  
5. Rezultati se prikazuju na frontend-u.

Uputstvo za pokretanje:
-Kloniranje repozitorijuma
-git clone https://github.com/Marta-I601/Baze_2.git
-cd Baze_2
-git checkout Docker

Na projektu rade:
Predrag Nikolic 642/2017 (Backend, fullstack i testing)
Aleksa Cirkovic 607/2018 (joker);
Marta Ignjatovic 601/2020 (Frontend, Devops i testing);
