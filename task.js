let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let edit = false;
const updateDashboard = () => {
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
};

const handleDelete = (id) => {
  const remain = tasks.filter((item) => item.id !== Number(id));
  tasks = remain;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  table(tasks);
  updateDashboard();
};

updateDashboard();
const table = (data) => {
  const tasklist = document.getElementById("taskBody");
  tasklist.innerHTML = "";
  data.forEach(
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
};
table(tasks);

const taskform = document.getElementById("taskForm");
const handlesubmit = () => {
  const obj = {
    id: Number(document.getElementById("taskid").value),
    title: document.getElementById("title").value,
    assignee: document.getElementById("assignee").value,
    status: document.getElementById("statusf").value,
    priority: document.getElementById("priorityf").value,
    tags: [...new Set(document.getElementById("tagf").value.split(", "))],
  };
  if (edit) {
    const index = tasks.findIndex((task) => task.id === Number(obj.id));
    tasks[index] = obj;
  } else {
    const existtask = new Set(tasks.map((item) => item.id));
    if (existtask.has(obj.id)) {
      alert("Task Id already exist");
      return;
    } else {
      tasks.push(obj);
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  edit = false;
  updateDashboard();
  return table(tasks);
};
taskform.addEventListener("submit", handlesubmit);

const handleedit = (id) => {
  const task = tasks.find((item) => item.id === Number(id));
  edit = true;
  document.getElementById("taskid").disabled = true;
  document.getElementById("taskid").value = task.id;
  document.getElementById("title").value = task.title;
  document.getElementById("assignee").value = task.assignee;
  document.getElementById("statusf").value = task.status;
  document.getElementById("priorityf").value = task.priority;
  document.getElementById("tagf").value = task.tags.join(", ");
};

const searchfield = (key, value) => {
  if (!value || !key) {
    return table(tasks);
  }
  const result = tasks.filter((item) => {
    // item[key].toLowerCase() == value.toLowerCase()
    if (Array.isArray(item[key])) {
      return item[key].join(" ").toLowerCase().includes(value.toLowerCase());
    } else {
      return item[key].toString().toLowerCase().includes(value.toLowerCase());
    }
  });
  return table(result);
};

const searchtext = document.getElementById("search");
const priority = document.getElementById("priority");
const field = document.getElementById("Field");
const statusv = document.getElementById("status");
const show = () => {
  if (field.value === "status" || field.value === "priority") {
    document.getElementById("search").style.display = "none";
    field.value === "status"
      ? ((statusv.style.display = "block"), (priority.style.display = "none"))
      : ((priority.style.display = "block"), (statusv.style.display = "none"));
  } else if (field.value === "") {
    document.getElementById("search").style.display = "none";
    priority.style.display = "none";
    statusv.style.display = "none";
    return table(tasks);
  } else {
    document.getElementById("search").style.display = "block";
    statusv.style.display = "none";
    priority.style.display = "none";
  }
};

field.addEventListener("change", show);
priority.addEventListener("change", () => {
  searchfield(field.value.trim(), priority.value);
});

statusv.addEventListener("change", () => {
  searchfield(field.value.trim(), statusv.value);
});

searchtext.addEventListener("input", () => {
  searchfield(field.value.trim(), searchtext.value.trim());
});
