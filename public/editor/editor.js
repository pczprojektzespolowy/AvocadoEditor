import { init, redirect } from "../js/firebase.js";
import { wylogujUzytkownika } from "../js/auth.js";
import { getProjectsList, getProject, updateProject } from "../js/storage.js";
import { exportPaintingToBase64, fileToBase64 } from "../js/utils.js";

const state = {
    pid: localStorage.getItem("pid"),
    pidTemp: "",
}

const onAuth = { 
    cb: async () => {
        DOM.setUserName();
        avatarImgs.forEach(avatar => { if(firebase.auth().currentUser.photoURL) return avatar.src = firebase.auth().currentUser.photoURL });
        const {pid} = state;
        if(pid){
            const projectJSON = await getProject(pid);
            console.log(projectJSON);
            canvas.loadFromJSON(projectJSON, canvas.renderAll.bind(canvas));
            pidInput.value = pid;
            pidInput.disabled = true;
        } else {
            //New project
            const circle = new fabric.Circle({radius: 20});
            canvas.add(circle);
        }
    },
    once: false,
};
const onNonAuth = {
    cb: () => {
        redirect("/");
    },
    once: false,
}

init(onAuth, onNonAuth);

//DOM Hooks

const workSpace = document.querySelector("#workSpace");

const canvasElement = document.querySelector("canvas#cnv");
//canvasElement.width = 60;
//canvasElement.height = 60;
const saveBtn = document.querySelector("#save");
const pidInput = document.querySelector("#projectID");
const errorText = document.querySelector("#error");
const exportLink = document.querySelector("#export");
const usernameElement = document.querySelector("#username");
const avatarImgs = document.querySelectorAll(".avatar");
const body = document.querySelector("body");
const dropMessage = document.querySelector("#dropMessage");


//DOM Props
const DOM = {
    handleSave: async (e) => {
        const {pid} = state;
        if(!pid){
            await APP.createProject(state.pidTemp, canvas);
        } else {
            await updateProject(state.pid, canvas);
        }
    },
    handlePidInput: (e) => {
        const val = e.target.value;
        state.pidTemp = val;
    },
    handleExport: e => {
        const data = canvas.toDataURL();
        e.target.href = data;
        e.target.download = state.pid || state.pidTemp;
    },
    setError: (err) => {
        errorText.textContent = err;
    },     setUserName: () => {
        const user = firebase.auth().currentUser
        if(user.displayName){
           usernameElement.textContent = user.displayName;
        }
    },
    cancelDefault: (e) => {
        e.preventDefault();
        e.stopPropagation();
    },
    showDragMessage: (e) => {
        DOM.cancelDefault(e)
        dropMessage.style.display = "block";
    },
    hideDragMessage: (e) => {
        DOM.cancelDefault(e);
        dropMessage.style.display = "none";
    },
    dropFile: async (e) => {
        DOM.cancelDefault(e);
        const file = e.dataTransfer.files[0];
        const b64 = await fileToBase64(file);
        new fabric.Image.fromURL(b64, img => {
            canvas.add(img);
        }, {
            crossOrigin: "anonymous"
        })
    },
    exportFile: async e => {
        e.href = exportPaintingToBase64(canvas)
    }
};

//DOM Actions
saveBtn.addEventListener("click", e => DOM.handleSave(e));
pidInput.addEventListener("change", e => DOM.handlePidInput(e));
exportLink.addEventListener("click", e => DOM.handleExport(e));
body.addEventListener("dragenter", DOM.showDragMessage);
body.addEventListener("dragleave", DOM.hideDragMessage);
body.addEventListener("dragover", DOM.showDragMessage);
body.addEventListener("drop", DOM.dropFile);

// //APP Hooks
// const c = new fabric.Canvas("cnv");

//APP Props 
const APP = {
    createProject: async (pid, canvas) => {
        if(pid === "") {
            DOM.setError("Please enter project name");
            return;
        }
        const uid = firebase.auth().currentUser.uid;
        const projects = await getProjectsList(uid);
        if(projects.some(({name}) => { name === pid})) {
            DOM.setError("Project name is already in use");
            return;
        }
        DOM.setError("");
        updateProject(pid, canvas);
    },
    saveProject: (pid, canvas) => {
        updateProject(pid, canvas);
    },
    addPhoto: (file) => {
        console.log(file);
    }
};
//Logout - sprawdzic czy to jest poprawnie zrobi
const loBtn = document.querySelector("#logout");
loBtn.addEventListener("click", wylogujUzytkownika);