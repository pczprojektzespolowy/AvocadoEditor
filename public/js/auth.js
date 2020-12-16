//Importuj po deklaracji firebase

function zarejestrujUzytkownika(email, haslo){
    firebase.auth().createUserWithEmailAndPassword(email, haslo)
        .then((uzytkownik) => {
            console.log("Udalo sie zarejestrowac: ", uzytkownik);
            console.log("Wysylanie wiadomosci weryfikacyjnej na mail...");
            uzytkownik.sendEmailVerification()
                .then((something) => console.log("Udalo sie wyslac? " , something))
                .catch(error => console.log("Nie udalo sie ", error));
        })
        .catch((blad) => {
            console.error("Nie udalo sie zarejestrowac: ", blad);
        })
}

function zalogujUzytkownika(email, haslo){
    firebase.auth().signInWithEmailAndPassword(email, haslo)
        .then((uzytkownik) => {
            console.log("Udalo sie zalogowac na konto: ", uzytkownik);
        })
        .catch((blad) => {
            console.error("Nie udalo sie zalogowac: ", blad);
        })
}

    //Zakladam ze mejle sa w miare normalne a nie "@@gmail.com"
    function walidujEmail(email){
        const kawalki = email.split("@");
        return kawalki.length > 1 && kawalki[kawalki.length - 2].length > 0 && kawalki[kawalki.length-1].indexOf(".") !== -1;
    }
    //Proste ale szczesliwe
    function walidujHaslo(haslo, dlugosc){
        return haslo.length > dlugosc;
    }

function wylogujUzytkownika(){
    firebase.auth().signOut()
        .then(() => {
            console.warn("User logged out!");
        })
        .catch((error) => {
            console.warn(error);
        })
}