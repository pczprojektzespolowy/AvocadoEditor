import { DEFAULT_THUMB_OPTIONS } from "./env.js";
import { exportPaintingToBase64, uuidv4 } from "./utils.js";

export async function getProjectsList(uid){
    const ref = firebase.storage().ref(`${uid}/projects`);
    const res = await ref.listAll();
    return res.prefixes;
}

export async function getThumbnails(projects){
    const thumbnails = [];
    for(const project of projects){
        const ref = firebase.storage().ref(`${project.fullPath}/thumbnail`);
        const url = await ref.getDownloadURL();
        thumbnails.push({
            pid: project.name,
            url,
        });
    }
    return thumbnails;
}

export async function getProject(pid) {
    const projectRef = firebase.storage().ref(`${firebase.auth().currentUser.uid}/projects/${pid}/canvas`);
    const url = await projectRef.getDownloadURL();
    const res = await fetch(url);
    const json = await res.json();
    return json;
}

export async function updateImage(userID, projectID, image){
    const imgRef = firebase.storage().ref(`${userID}/projects/${projectID}/images/${image.id}`);
    const snapshot = await imgRef.putString(image.url, "data_url", {name: image.id});
    const url = await snapshot.ref.getDownloadURL();
    return url;
}

async function updateCanvas(pid, canvas){
    const uid = firebase.auth().currentUser.uid;
    const images = canvas.getObjects("image");
    for(const image of images){
        const url = await updateImage(uid, pid, { id: image.id || uuidv4(), url: image.getSrc()});
        image.setSrc(url);
    }
    const canvasJSON = JSON.stringify(canvas.toDatalessJSON(["id"]));
    const canvasBlob = new Blob([canvasJSON], {type: "application/json"});
    const canvasRef = firebase.storage().ref(`${uid}/projects/${pid}/canvas`);
    await canvasRef.put(canvasBlob, {contentType: "application/json"});
}

async function updateThumbnail(pid, image){
    const uid = firebase.auth().currentUser.uid;
    const thumbnailRef = firebase.storage().ref(`${uid}/projects/${pid}/thumbnail`);

    const data = await exportPaintingToBase64(image, DEFAULT_THUMB_OPTIONS);

    await thumbnailRef.putString(data, "data_url");
}

export async function updateProject(pid, canvas){
    await updateCanvas(pid, canvas);
    await updateThumbnail(pid, canvas.getElement());
}