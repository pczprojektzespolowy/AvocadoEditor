import { deleteUser, updateUserPassword, wylogujUzytkownika } from "../js/auth.js";
import { init, redirect } from "../js/firebase.js";
import { updateUserAvatar } from "../js/storage.js";

const onAuth = {
    cb: async () => {
        APP.setUser()
        APP.setAvatars()
    },
    once: true
};
const onNonAuth = {
    cb: () => {
        redirect('/')
    },
    once: false
}
init(onAuth,onNonAuth);

const DOM = {
    usernames: document.querySelectorAll(".username"),
    email: document.querySelector("#email"),
    newPassword: document.querySelector("#newPassword"),
    confirmPassword: document.querySelector("#confirmPassword"),
    passwordInfo: document.querySelector("#passwordInfo"),
    updatePassword: document.querySelector("#updatePassword"),
    deleteUser: document.querySelector("#deleteUser"),
    logout: document.querySelector("#logout"),
    avatarFile: document.querySelector("#avatarFile"),
    avatarUpload: document.querySelector("#avatarUpload"),
    avatarImgs: document.querySelectorAll(".avatar"),
    avatarInfo: document.querySelector("#avatarInfo"),
}

const APP = {
    updatePassword: async (newPassword, confirmPassword) => {
        if(newPassword.length === 0 || newPassword !== confirmPassword) return "Passwords should match";
        try {
            const res = await updateUserPassword(newPassword);
            return "Password has been successfully changed!";
        } catch (error) {
            return error.message
        }
    },
    deleteUser: async () => {
        const res = await deleteUser();
        if(res) redirect('/');
    },
    logOut: () => {
        wylogujUzytkownika()
    },
    clearInfo: (e) => {
        DOM.passwordInfo.textContent = ""
    },
    setAvatars: () => {
        const url = firebase.auth().currentUser.photoURL;
        if(url){
            DOM.avatarImgs.forEach(avatar => avatar.src = url)
        }
    },
    setUser: () => {
        const user = firebase.auth().currentUser
        DOM.email.textContent = user.email
        DOM.usernames.forEach(username => username.textContent = user.displayName)
    }
}

DOM.confirmPassword.addEventListener("input", APP.clearInfo);
DOM.newPassword.addEventListener("input", APP.clearInfo);

DOM.updatePassword.addEventListener("click", async e => {
    e.preventDefault();
    const info = await APP.updatePassword(DOM.newPassword.value, DOM.confirmPassword.value);
    DOM.passwordInfo.textContent = info;
})

DOM.deleteUser.addEventListener("click", e => {
    APP.deleteUser();
})

DOM.logout.addEventListener("click", e => {
    APP.logOut()
})

DOM.avatarUpload.addEventListener("click", e => {
    e.preventDefault();
    if(DOM.avatarFile.files?.[0]){
        updateUserAvatar(DOM.avatarFile.files?.[0])
    }
    avatarInfo.textContent = "Avatar has been updated!"
})