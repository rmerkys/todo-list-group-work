import { sum } from "./index.js";
import { appendBtn } from "./index.js";

describe("sum", () => {
  test("The function correctly adds two positive numbers", () => {
    let a = 1;
    let b = 2;
    expect(sum(a, b)).toBe(3);
  });
});
test("Check heart add to list", () => {
  document.body.innerHTML = `
    <li class="list-top">
        <input type="checkbox"  id="done" checked onclick="myFunction(${data.id})">
        <p class="text">${data.task}</p>
        <button class="buttons" onClick=handlePostEdit(${data.id}) id="editBtn">Redaguoti</button>
        <button onClick=deletePost(${data.id}) id="deleteBtn">Ištrinti</button>
        <i id="icon" class="${heart} fa-heart" onclick="favorite(${data.id})"></i>
    </li>
     `;
  require("./task2.js");

  const newLi = document.getElementByClassName("li");
  const newCheckedInput = document.getElementById("done");
  const p = document.getElementsByClassName("p");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  p.value = "new list";
  editBtn.click();
  expect(newLi.innerHTML).toBe("new list");
});
