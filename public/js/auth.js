//Importuj po deklaracji firebase

//SESJA
//Przekieruj jezeli brak uzytkownika
function przekierujDo(path){
    if(window.location.pathname !== path)window.location.replace(path);
}
firebase.auth().onAuthStateChanged(user => {
    firebase.auth().useDeviceLanguage();
    if(user === null) przekierujDo("/");
  });

async function zarejestrujUzytkownika(nazwa, email, haslo, haslo2){
    const info = await firebase.auth().createUserWithEmailAndPassword(email, haslo)
        .then((_) => {
            const uzytkownik = firebase.auth().currentUser;
            uzytkownik.sendEmailVerification();
            uzytkownik.updateProfile({
                displayName: nazwa,
            });
            firebase.auth().signOut();
            return { message: "Uzytkownik utworzony pomyslnie. Prosimy o potwierdzenie adresu email."}
        }).catch(blad => blad.message);
    return info;
}

async function zalogujUzytkownika(email, haslo){
    const info = await firebase.auth().signInWithEmailAndPassword(email, haslo).then(uzytkownik => {
            if(!uzytkownik.user.emailVerified) {
                uzytkownik.user.sendEmailVerification();
                throw Error("Potwierdz adres email!");
            }
            window.location.assign("/projects.html");
        }).catch(blad => blad.message);
    return info;
}

function wylogujUzytkownika(){
    firebase.auth().signOut()
        .then(() => {
            window.location.assign("/");
        })
        .catch((error) => ({tekst: blad.message}))
}

// WALIDACJA
    function walidujRejestracje(nazwa, email, haslo, haslo2){
        const nazwaInfo = walidujNazwe(nazwa, 1) ? "" : "Nazwa niepoprawna.";
        const emailInfo = walidujEmail(email) ? "" : "Email niepoprawny.";
        const hasloInfo = walidujHaslo(haslo, haslo2, 8) ? "" : "Hasla powinno zawierac 8 znakow oraz byc jednakowe.";
        return [
            nazwaInfo,
            emailInfo,
            hasloInfo,
        ];
    }
    function walidujNazwe(nazwa, dlugosc){
        return nazwa.length >= dlugosc;
    }
    function walidujEmail(email){
        const kawalki = email.split("@");
        return kawalki.length > 1 && kawalki[kawalki.length - 2].length > 0 && kawalki[kawalki.length-1].indexOf(".") !== -1;
    }
    function walidujHaslo(haslo, haslo2, dlugosc){
        return haslo.length >= dlugosc && haslo === haslo2;
    }