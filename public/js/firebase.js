const _firebaseConfig = {
    apiKey: "AIzaSyCmvJpt1pZ7-vExILBEmrYiM41CVow9luA",
    authDomain: "projekt-zespolowy-pcz.firebaseapp.com",
    projectId: "projekt-zespolowy-pcz",
    storageBucket: "projekt-zespolowy-pcz.appspot.com",
    messagingSenderId: "499165190463",
    appId: "1:499165190463:web:7a7757a49cabfd1238db8a"
};
export const appName = "Avocado Editor";

/* 
  onAuth, onNonAuth {
    cb: () => {};
    once: Boolean
  }
*/

export function init(onAuth, onNonAuth) {
  console.log("INIT STARTED");
  let onAuthDone = false;
  let onNonAuthDone = false;
  firebase.initializeApp(_firebaseConfig,/* appName */);
  firebase.auth().onAuthStateChanged(user => {
    firebase.auth().useDeviceLanguage();
    if(user){
      if(!onAuthDone){
        onAuth.cb();
        onAuthDone = !onAuth.once;
      }
    } else {
      if(!onNonAuthDone){
        onNonAuth.cb();
        onNonAuthDone = !onNonAuth.once;
      }
    }
  })
}
export function redirect(path){
  if(location.pathname !== path) location.replace(path);
}