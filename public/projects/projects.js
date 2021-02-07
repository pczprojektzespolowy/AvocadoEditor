import { init, redirect } from "../js/firebase.js";
import { wylogujUzytkownika } from "../js/auth.js";
import { getProjectsList, getThumbnails } from "../js/storage.js";

function setPID(pid) { 
    localStorage.setItem("pid", pid);
}

const onAuth = {
    cb: async () => {
        const uid = firebase.auth().currentUser.uid;
        const projects = await getProjectsList(uid);
        const thumbs = await getThumbnails(projects);
        DOM.createThumbs(thumbsParent, thumbs);
    },
    once: false,
};
const onNonAuth = {
    cb: () => {
        redirect('/');
    },
    once: false,
};

init(onAuth, onNonAuth);

//App props
const APP = {
    logOut: () => { wylogujUzytkownika(); },
    createProject: () => {
        localStorage.removeItem("pid");
        redirect("/editor");
    },
}

//DOM Hooks
const thumbsParent = document.querySelector("div#thumbs");
const logoutBtn = document.querySelector("button#logout");
const createProjectBtn = document.querySelector("button#createProject");

//DOM Props
const DOM = {
    createThumbs: (parent, thumbs) => {
        let results = [];
        thumbs.forEach(thumb => {
            const thumbElement = document.createElement("div");
            //Maybe we will change that in a future
            thumbElement.id = thumb.pid;
            thumbElement.dataset.pid = thumb.pid;
            thumbElement.classList.add("thumbs-item");
            const thumbImg = document.createElement("img");
            thumbImg.src = thumb.url;
            thumbElement.append(thumbImg);
            const thumbName = document.createElement("p");
            thumbName.textContent = thumb.pid;
            thumbElement.addEventListener("click", e => {
                setPID(thumb.pid);
                location.assign("/editor/");
            });
            thumbElement.append(thumbName);
            results.push(thumbElement);
        });
        parent.replaceChildren(...results);
    },
}

//DOM Actions
logoutBtn.addEventListener("click", APP.logOut);
createProjectBtn.addEventListener("click", APP.createProject);