const splash = document.querySelector('.splash');
const btns = document.querySelectorAll('.navBar .btns button');
const modal = document.querySelector('.modal')
const modalIn = document.querySelector('.modalIn')
const modalUp = document.querySelector('.modalUp')
let isModalActive = false;

const modalChoice = (e) =>{
    isModalActive = !isModalActive;
    modal.style.display = "block";
    const txt = e.target.textContent;
    if(txt === "Sign In"){
        modalIn.classList.add("active");
        modalUp.classList.remove("active");
    }
    else if(txt === "Sign Up"){
        modalIn.classList.remove("active");
        modalUp.classList.add("active");        
    }
}

window.onclick = function(e) {

    if (e.target === modal) {
        modal.style.display = "none"
    }
  }




window.addEventListener('load', ()=>{
    splash.classList.add("active")
    setTimeout(()=>{
        splash.classList.remove("active")
    },3000)
})


btns[0].addEventListener('click', modalChoice) 
btns[1].addEventListener('click', modalChoice)





