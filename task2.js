const addTaskForm = document.getElementById("task-input");
const taskContainer = document.getElementById("task-box");


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








let editPostId = null;
const API_ENDPOINTS = {
  post: "https://testapi.io/api/RokasM/resource/tasks",
  get: "https://testapi.io/api/RokasM/resource/tasks",
  getPostById: (id) => `	https://testapi.io/api/RokasM/resource/tasks/${id}`,
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
      check: "unchecked",
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
  console.log(data)
  return `
<li id=${data.id}>
    <input type="checkbox" id="done" value=${data.check}>
    <p>${data.task}</p>
    <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
    <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
</li>
 `;
 return console.log(data)
};
const handlePostEdit = async (id) => {
  editPostId = id;
  const postDataById = await getPostById(id);
  const arr = [...addTaskForm.getElementsByTagName("input")];
  arr.forEach((input) => {
    input.value = postDataById[data.task];
  });
  handleButtonName("Update Post");
};
const handlePostUpdate = async (formData, id) => {
  const updatedPost = await editData(
    API_ENDPOINTS.edit(id),
    new URLSearchParams(formData)
  );
  document.getElementById(id).remove();
  taskContainer.innerHTML += postTemplate(updatedPost);
  editPostId = null;
  handleButtonName("Add Post");
};
const handleFormSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  if (editPostId) {
    handlePostUpdate(formData, editPostId);
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