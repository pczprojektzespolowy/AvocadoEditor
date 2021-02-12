import { init, redirect } from "./js/firebase.js";
import { zalogujUzytkownika, zarejestrujUzytkownika, walidujRejestracje } from "./js/auth.js";

const onAuth = {
    cb: () => {
        redirect("/projects");
    },
    once: false,
};
const onNonAuth = {
    cb: () => {
        redirect('/');
    },
    once: true,
};

init(onAuth, onNonAuth);

//DOM Hooks
const loginFormularz = document.querySelector("form#login");
const rejestracjaFormularz = document.querySelector("form#rejestracja");

//DOM Props
const DOM = {
    obsluzLogowanie: async (zdarzenie) => {
        zdarzenie.preventDefault();
        const cel = zdarzenie.target;
        const email = cel.querySelector("#loginEmail").value;
        const haslo = cel.querySelector("#loginHaslo").value;
        const infoEl = cel.querySelector("#loginInfo");
        const info = await zalogujUzytkownika(email, haslo);
        infoEl.innerHTML = info;
    },
    obsluzRejestracje: async (zdarzenie) => {
        zdarzenie.preventDefault();
        const cel = zdarzenie.target;
        const nazwa = cel.querySelector("#rejestracjaNazwa").value;
        const email = cel.querySelector("#rejestracjaEmail").value;
        const haslo = cel.querySelector("#rejestracjaHaslo").value;
        const haslo2 = cel.querySelector("#rejestracjaHasloPowtorz").value;
        const infoEl = cel.querySelector("#rejestracjaInfo");
        let walidacja = walidujRejestracje(nazwa, email, haslo, haslo2).filter(blad => blad.length > 0);
        infoEl.innerHTML = walidacja.length === 0 ? await zarejestrujUzytkownika(nazwa, email, haslo) : walidacja.join("<br />");
    }
};

//DOM Actions
loginFormularz.addEventListener("submit", DOM.obsluzLogowanie);
rejestracjaFormularz.addEventListener("submit", DOM.obsluzRejestracje);
