const appendBtn = document.getElementById("appendRegister");

appendBtn.addEventListener("click", function () {
  const registerForm = document.getElementById("register");
  if (registerForm.style.display !== "none") {
    registerForm.style.display = "none";
  } else {
    registerForm.style.display = "block";
  }
});
