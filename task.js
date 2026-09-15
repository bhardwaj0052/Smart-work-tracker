const handleDelete = (id) => {
  const remain = tasks.filter((item) => item.id != id);
  tasks = remain;
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(tasks);
const totallength = tasks.length;
document.getElementById("task").innerHTML = "Total task =" + totallength;

const todo = tasks.filter((item) => item.status === "Todo");
document.getElementById("todo").innerHTML = "Todo =" + todo.length;

const inprogress = tasks.filter((item) => item.status === "In Progress");
document.getElementById("inprogress").innerHTML =
  "In Progress =" + inprogress.length;

const completed = tasks.filter((item) => item.status === "Completed");
document.getElementById("completed").innerHTML =
  "Completed =" + completed.length;

const table = (data) =>{
const tasklist = document.getElementById("taskBody");
tasklist.innerHTML = ""
const rows = data.map(
  (task) =>
    (tasklist.innerHTML += `
    <tr>
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.assignee}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
      <td>${task.tags.join(", ")}</td>
      <td><button onclick="handleedit(${task.id})">Edit</button> <button onclick="handleDelete(${task.id})">Delete</button></td>
    </tr>`),
);
}
table(tasks)

const taskform = document.getElementById("taskForm");
const handlesubmit = () => {
  const obj = {
    id: !document.getElementById("taskid").value
      ? Date.now()
      : document.getElementById("taskid").value,
    title: document.getElementById("title").value,
    assignee: document.getElementById("assignee").value,
    status: document.getElementById("statusf").value,
    priority: document.getElementById("priorityf").value,
    tags: document.getElementById("tagf").value.split(", ")
  };
  const existdata = tasks.findIndex((item) => item.id == obj.id);
  if (existdata !== -1) {
    tasks[existdata] = obj;
  } else {
    tasks.push(obj);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  return table(tasks);
};
taskform.addEventListener("submit", handlesubmit);

const handleedit = (id) => {
  const task = tasks.find((item) => item.id == id);
  const taskId = (document.getElementById("taskid").value = task.id);
  const title = (document.getElementById("title").value = task.title);
  const assignee = (document.getElementById("assignee").value = task.assignee);
  const status = (document.getElementById("statusf").value = task.status);
  const priority = (document.getElementById("priorityf").value = task.priority);
  const tags = (document.getElementById("tagf").value = task.tags.join(", "));
};

const searchfield = () => {
  const value = document.getElementById("search").value.trim()
  if (!value) {
    return table([]);
  }
  const result = tasks.filter(
    (item) =>
      item.id == value ||
      item.assignee.toLowerCase().includes(value.toLowerCase()) ||
      item.title.toLowerCase().includes(value.toLowerCase()),
  );
  return table(result);
};

