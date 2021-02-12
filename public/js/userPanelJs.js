const userBtn = document.querySelector('.userPanel');
const modalUser = document.querySelector('.modalUser');

const displayModal = ()=>{
    modalUser.style.display = "block";
}

userBtn.addEventListener('click', displayModal);

window.onclick = function(e) {
    if (e.target !== modalUser && !userBtn.contains(e.target)) {
        modalUser.style.display = "none"
    }
  }
