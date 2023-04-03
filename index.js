const loginForm = document.querySelector("#login");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const registerForm = document.querySelector("#register");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  fetch("https://testapi.io/api/RokasM/resource/Logins", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const newLogin = data.data.filter((user) => {
        if (
          user.username == username.value &&
          user.password == password.value
        ) {
          const userString = JSON.stringify(username.value);
          localStorage.setItem("identification", `${userString}`);
          // loginform.style.display = "none";
          // createForm.style.display = "block";
          username.value = "";
          password.value = "";
          window.location = "task2.html";
          return;
        }
        return;
      });
    })
    .catch((err) => console.log(err));
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const registerUsername = e.target.elements[0].value;
  const registerPassword = e.target.elements[1].value;
  const repeatPassword = e.target.elements[2].value;

  if (registerPassword === repeatPassword) {
    fetch("https://testapi.io/api/RokasM/resource/Logins", {
      method: "POST",
      body: JSON.stringify({
        username: registerUsername,
        password: registerPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const userString1 = JSON.stringify(registerUsername.value);
        localStorage.setItem("identification", `${userString1}`);
        registerUsername.value = "";
        registerPassword.value = "";
        repeatPassword.value = "";
        window.location.reload();
        return data;
      })
      .catch((err) => console.log(err));
  }
});
const appendBtn = document.getElementById("appendRegister");

appendBtn.addEventListener("click", function () {
  const registerForm = document.getElementById("register");
  if (registerForm.style.display !== "none") {
    registerForm.style.display = "none";
  } else {
    registerForm.style.display = "block";
  }
});
