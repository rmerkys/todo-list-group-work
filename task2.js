const addTaskForm = document.getElementById("task-input");
const taskContainer = document.getElementById("task-box");

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
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      task: task,
      check: "false",
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
  console.log(data);
  if (data.check === "true") {
    return `
    <li id=${data.id}>
        <input type="checkbox"  id="done" checked onclick="myFunction(${data.id})">
        <p>${data.task}</p>
        <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
        <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
    </li>
     `
  } else {
    return `
    <li id=${data.id}>
        <input type="checkbox"  id="done" onclick="myFunction(${data.id})">
        <p>${data.task}</p>
        <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
        <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
    </li>
     `
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
    JSON.stringify({ task: formData, check: getDataById.check })
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

// addTaskForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const task = document.getElementById("taskInput").value

//     fetch("https://testapi.io/api/RokasM/resource/tasks", {
//       method: "POST",
//       body: JSON.stringify({
//         task: task,
//         check: "unchecked",
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         return data;
//       })
//       .catch((err) => console.log(err));
// });

// const taskTemplate = (data) => {
//   const x = JSON.stringify(data);
//   return `
//     <li id=${data.id}>
//         <input type="checkbox" id="done" value=${data.check}>
//         <p>${data.task}</p>
//         <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
//         <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
//     </li>
//     `;
// };
function myFunction(id) {
  const toDoItem = document.getElementById(id);
  const paragraph = toDoItem.getElementsByTagName("p")[0];
  console.log(paragraph)
  const paragraphText = paragraph.textContent
  console.log(paragraphText)
  const checkBox = toDoItem.getElementsByTagName("input")[0].checked;
  console.log(checkBox)
  const toDoFormData = new FormData();
  toDoFormData.append("task", paragraphText);
  toDoFormData.append("check", checkBox);
  const data = new URLSearchParams(toDoFormData);
  console.log(data);
  const url = `https://testapi.io/api/RokasM/resource/tasks/${id}`;
  if (toDoItem.checked) {
    return fetch(url, {
      method: "PUT",
      body: data,
    });
  } else {
    const url = `https://testapi.io/api/RokasM/resource/tasks/${id}`;
    return fetch(url, {
      method: "PUT",
      body: data,
    });
  }
}
