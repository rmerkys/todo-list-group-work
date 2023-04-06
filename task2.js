const addTaskForm = document.getElementById("task-input");
const taskContainer = document.getElementById("task-box");
const favoriteContainer = document.getElementById("favorite-box");

let editPostId = null;
const API_ENDPOINTS = {
  post: "https://testapi.io/api/RokasM/resource/tasks",
  get: "https://testapi.io/api/RokasM/resource/tasks",
  getPostById: (id) => `	https://testapi.io/api/RokasM/resource/tasks/${id}`,
  PUT: (id) => `	https://testapi.io/api/RokasM/resource/tasks/${id}`,
  edit: (id) => `https://testapi.io/api/RokasM/resource/tasks/${id}`,
  delete: (id) => `https://testapi.io/api/RokasM/resource/tasks/${id}`,
};
const handleButtonName = (name) => {
  const btn = document.querySelector("button[type=submit]");
  btn.innerText = name;
};
const getData = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
const getPostById = (id) => {
  const url = API_ENDPOINTS.getPostById(id);
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
const editData = (url, data) => {
  return fetch(url, {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
const deletePost = (id) => {
  const url = API_ENDPOINTS.delete(id);
  return fetch(url, {
    method: "DELETE",
  })
    .then((response) => {
      response.status === 204 && document.getElementById(id).remove();
    })
    .catch((err) => console.log(err));
};
const postData = (url, data) => {
  const task = document.getElementById("taskInput").value;
  const favoriteValue = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      task: task,
      check: "false",
      favorite: favoriteValue,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};
const postTemplate = (data) => {
  const x = JSON.stringify(data);
  if (data.check === "true" && data.favorite === "1") {
    const heart = "fa-solid";
    return `
    <li class="list-top"  id=${data.id}>
        <input type="checkbox"  id="done" checked onclick="myFunction(${data.id})">
        <p class="text">${data.task}</p>
        <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
        <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
        <i id="icon" class="${heart} fa-heart" onclick="favorite(${data.id})"></i>
    </li>
     `;
  } else if (data.check === "false" && data.favorite === "1") {
    const heart = "fa-solid";
    return `
    <li class="list-top" id=${data.id}>
        <input type="checkbox"  id="done" onclick="myFunction(${data.id})">
        <p>${data.task}</p>
        <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
        <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
        <i id="icon" class="${heart} fa-heart" onclick="favorite(${data.id})"></i>
    </li>
     `;
  } else if (data.check === "true" && data.favorite === "0") {
    const heart = "fa-regular";
    return `
    <li id=${data.id}>
        <input type="checkbox"  id="done" checked onclick="myFunction(${data.id})">
        <p class="text">${data.task}</p>
        <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
        <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
        <i id="icon" class="${heart} fa-heart" onclick="favorite(${data.id})"></i>
    </li>
     `;
  } else {
    const heart = "fa-regular";
    return `
    <li id=${data.id}>
        <input type="checkbox"  id="done" onclick="myFunction(${data.id})">
        <p>${data.task}</p>
        <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
        <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
        <i id="icon" class="${heart} fa-heart" onclick="favorite(${data.id})"></i>
    </li>
     `;
  }

  //   return `
  // <li id=${data.id}>
  //     <input type="checkbox"  id="done" ${checkBoxLogic} onclick="myFunction(${data.id})">
  //     <p>${data.task}</p>
  //     <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
  //     <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
  // </li>
  //  `;
};

const handlePostEdit = async (id) => {
  editPostId = id;
  const postDataById = await getPostById(id);
  const arr = [...addTaskForm.getElementsByTagName("input")];
  console.log(postDataById);
  arr.forEach((input) => {
    console.log(input);
    input.value = postDataById.task;
  });
  handleButtonName("Redaguoti užduotį");
};
const handlePostUpdate = async (formData, id) => {
  const getDataById = await getPostById(id);
  console.log(id);
  const updatedPost = await editData(
    API_ENDPOINTS.edit(id),
    JSON.stringify({
      task: formData,
      check: getDataById.check,
      favorite: getDataById.favorite,
    })
  );
  document.getElementById(id).remove();
  taskContainer.innerHTML += postTemplate(updatedPost);
  editPostId = null;
  handleButtonName("Pridėti užduotį");
};
const handleFormSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const etarget = e.target.elements[0].value;
  if (editPostId) {
    handlePostUpdate(etarget, editPostId);
    // const values = formData.values()
    // console.log(values)
  } else {
    const newPost = await postData(API_ENDPOINTS.post, formData);
    taskContainer.innerHTML += postTemplate(newPost);
  }
  e.target.reset();
};
addTaskForm.addEventListener("submit", handleFormSubmit);
window.onload = async () => {
  const posts = await getData(API_ENDPOINTS.get);
  posts.data.forEach((post) => {
    taskContainer.innerHTML += postTemplate(post);
  });
};

function myFunction(id) {
  const toDoItem = document.getElementById(id);
  const paragraph = toDoItem.getElementsByTagName("p")[0];
  console.log(paragraph);
  const paragraphText = paragraph.textContent;
  console.log(paragraphText);
  const checkBox = toDoItem.getElementsByTagName("input")[0].checked;
  console.log(checkBox);
  const heart = toDoItem.getElementsByTagName("i")[0];
  console.log(heart);
  if (heart.classList.contains("fa-regular")) {
    const favoriteValue = 0;
    const toDoFormData = new FormData();
    toDoFormData.append("task", paragraphText);
    toDoFormData.append("check", checkBox);
    toDoFormData.append("favorite", favoriteValue);
    const data = new URLSearchParams(toDoFormData);
    const url = `https://testapi.io/api/RokasM/resource/tasks/${id}`;
    fetch(url, {
      method: "PUT",
      body: data,
    });
  } else {
    const favoriteValue = 1;
    const toDoFormData = new FormData();
    toDoFormData.append("task", paragraphText);
    toDoFormData.append("check", checkBox);
    toDoFormData.append("favorite", favoriteValue);
    const data = new URLSearchParams(toDoFormData);
    const url = `https://testapi.io/api/RokasM/resource/tasks/${id}`;
    fetch(url, {
      method: "PUT",
      body: data,
    });
  }
}
function favorite(id) {
  const toDoItem = document.getElementById(id);
  const paragraph = toDoItem.getElementsByTagName("p")[0];
  // console.log(paragraph)
  const paragraphText = paragraph.textContent;
  // console.log(paragraphText)
  const checkBox = toDoItem.getElementsByTagName("input")[0].checked;
  // console.log(checkBox)
  const heart = toDoItem.getElementsByTagName("i")[0];
  // console.log(heart)
  if (heart.classList.contains("fa-regular")) {
    heart.classList.remove("fa-regular");
    heart.classList.add("fa-solid");
    const favoriteValue = 1;
    const toDoFormData = new FormData();
    toDoFormData.append("task", paragraphText);
    toDoFormData.append("check", checkBox);
    toDoFormData.append("favorite", favoriteValue);
    const data = new URLSearchParams(toDoFormData);
    const url = `https://testapi.io/api/RokasM/resource/tasks/${id}`;
    fetch(url, {
      method: "PUT",
      body: data,
    });
    setTimeout(()=>{location.reload()}, 200);
  } else {
    heart.classList.remove("fa-solid");
    heart.classList.add("fa-regular");
    const favoriteValue = 0;
    const toDoFormData = new FormData();
    toDoFormData.append("task", paragraphText);
    toDoFormData.append("check", checkBox);
    toDoFormData.append("favorite", favoriteValue);
    const data = new URLSearchParams(toDoFormData);
    const url = `https://testapi.io/api/RokasM/resource/tasks/${id}`;
    fetch(url, {
      method: "PUT",
      body: data,
    });
    setTimeout(()=>{location.reload()}, 200);
  }
}


// async function getTaskById(id) {
//   try {
//     const response = await fetch (`https://testapi.io/api/RokasM/resource/tasks/${id}`)
//     if (!response.ok) {
//       throw new Error('Network response was not ok')
      
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('errer fetching user', error);
//   }
// }