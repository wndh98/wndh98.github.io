const modal = document.getElementById('modal');
const btnOpenModal=document.getElementById('menu05');
const btnCloseModal=document.getElementById('close');

btnOpenModal.onclick=function(){
    modal.classList.add("modal_on");
    // alert(1);
} 
btnCloseModal.onclick=function(){

    modal.classList.remove("modal_on");
    // console.log(2);
} 
function oninputPhone(target) {
    target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
}
// btnOpenModal.addEventListener("click", ()=>{
// });