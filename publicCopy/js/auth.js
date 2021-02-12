//SESJA
export async function zarejestrujUzytkownika(nazwa, email, haslo){
    const info = await firebase.auth().createUserWithEmailAndPassword(email, haslo)
        .then((_) => {
            const uzytkownik = firebase.auth().currentUser;
            uzytkownik.sendEmailVerification();
            uzytkownik.updateProfile({
                displayName: nazwa,
            });
            firebase.auth().signOut();
            return "User created successfully. Please confirm your email address.";
        }).catch(blad => blad.message);
    return info;
}

export async function zalogujUzytkownika(email, haslo){
    const info = await firebase.auth().signInWithEmailAndPassword(email, haslo).then(uzytkownik => {
            if(!uzytkownik.user.emailVerified) {
                uzytkownik.user.sendEmailVerification();
                throw Error("Confirm your email address!");
            }
            window.location.assign("/projects.html");
            return "";
        }).catch(blad => blad.message);
    return info;
}

export function wylogujUzytkownika(){
    firebase.auth().signOut()
        .then(() => {
            window.location.assign("/");
        })
        .catch((error) => ({tekst: blad.message}))
}

// WALIDACJA
export function walidujRejestracje(nazwa, email, haslo, haslo2){
        const nazwaInfo = walidujNazwe(nazwa, 1) ? "" : "Invalid username.";
        const emailInfo = walidujEmail(email) ? "" : "Invalid email address.";
        const hasloInfo = walidujHaslo(haslo, haslo2, 8) ? "" : "Passwords should match and be 8 char long.";
        return [
            nazwaInfo,
            emailInfo,
            hasloInfo,
        ];
    }
export function walidujNazwe(nazwa, dlugosc){
        return nazwa.length >= dlugosc;
    }
export function walidujEmail(email){
        const kawalki = email.split("@");
        return kawalki.length > 1 && kawalki[kawalki.length - 2].length > 0 && kawalki[kawalki.length-1].indexOf(".") !== -1;
    }
export function walidujHaslo(haslo, haslo2, dlugosc){
        return haslo.length >= dlugosc && haslo === haslo2;
    }