import { init, redirect } from "../js/firebase.js";
import { getProjectsList, getProject, updateProject } from "../js/storage.js";

const state = {
    pid: localStorage.getItem("pid"),
    pidTemp: "",
}

const onAuth = { 
    cb: async () => {
        const {pid} = state;
        if(pid){
            const projectJSON = await getProject(pid);
            c.loadFromJSON(projectJSON, c.renderAll.bind(c));
            pidInput.value = pid;
            pidInput.disabled = true;
        } else {
            //New project
            const circle = new fabric.Circle({radius: 50});
            c.add(circle);
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
const canvasElement = document.querySelector("canvas#cnv");
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
const saveBtn = document.querySelector("button#save");
const pidInput = document.querySelector("input#projectID");
const errorText = document.querySelector("span#error");
const exportBtn = document.querySelector("#export");

//DOM Props
const DOM = {
    handleSave: async (e) => {
        const {pid} = state;
        if(!pid){
            await APP.createProject(state.pidTemp, c);
        } else {
            await updateProject(state.pid, c);
        }
    },
    handlePidInput: (e) => {
        const val = e.target.value;
        state.pidTemp = val;
    },
    handleExport: e => {
        const data = c.toDataURL();
        e.target.href = data;
        e.target.download = state.pid || state.pidTemp;
    },
    setError: (err) => {
        errorText.textContent = err;
     }
};

//DOM Actions
saveBtn.addEventListener("click", e => DOM.handleSave(e));
pidInput.addEventListener("change", e => DOM.handlePidInput(e));
exportBtn.addEventListener("click", e => DOM.handleExport(e));

//APP Hooks
const c = new fabric.Canvas("cnv");

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
    }
};