// =========================
// Page Transition
// =========================

document.addEventListener("DOMContentLoaded", () => {

    document.body.classList.add("fade-in");

});

function goTo(url){

    document.body.classList.remove("fade-in");
    document.body.classList.add("fade-out");

    setTimeout(() => {

        window.location.href = url;

    }, 300);

}