"use strict";
let todoList = []; 

const BIN_ID = ""
const Master_Key = ""

let init = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            todoList = JSON.parse(req.responseText).record;
            if (todoList[0].placeholder) {
                todoList = []
            }
            updateTodoList();
        }
    };
    req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, true);
    req.setRequestHeader("X-Master-Key", `${Master_Key}`);
    req.send();
};

let updateJSONbin = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
    };
    req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", `${Master_Key}`);
    let dataToSend = todoList.length ? todoList : [{ placeholder: "empty" }];
    req.send(JSON.stringify(dataToSend));
};

let updateTodoList = function() {
    let filterInput = document.getElementById("inputSearch").value.toLowerCase();
    let beginDate = new Date(document.getElementById("beginDate").value);
    let endDate = new Date(document.getElementById("endDate").value);

    const tableBody = document.querySelector('#json-table tbody');
    tableBody.innerHTML = '';
    todoList.forEach((todo, index) => {
        let todoDate = new Date(todo.dueDate);
        if ((!filterInput || todo.title.toLowerCase().includes(filterInput) || todo.description.toLowerCase().includes(filterInput))
            && (isNaN(beginDate) || (!isNaN(beginDate) && beginDate <= todoDate)) && (isNaN(endDate) || (!isNaN(endDate) && endDate >= todoDate))        
        ) {
            const row = document.createElement('tr');
            
            const title = document.createElement('td');
            title.textContent = todo.title;
            row.appendChild(title);
            
            const description = document.createElement('td');
            description.textContent = todo.description;
            row.appendChild(description);
            
            const place = document.createElement('td');
            place.textContent = todo.place;
            row.appendChild(place);
            
            const dueDate = document.createElement('td');
            dueDate.textContent = new Date(todo.dueDate).toLocaleDateString();
            row.appendChild(dueDate);

            const category = document.createElement('td');
            category.textContent = todo.category;
            row.appendChild(category);
            
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger btn-sm";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteTodo(index);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);
            
            tableBody.appendChild(row);
        }
    });
};

let deleteTodo = function(index) {
    todoList.splice(index, 1);
    updateJSONbin();
    updateTodoList();
};

let addTodo = async function() {
    let newTodo = {
        title: document.getElementById("inputTitle").value,
        description: document.getElementById("inputDescription").value,
        place: document.getElementById("inputPlace").value,
        dueDate: document.getElementById("inputDate").value
    };
    let taskDescription = newTodo.title + " " + newTodo.description;

    await categorizeTask(taskDescription).then(category => {
        console.log("Category:", category);
        newTodo.category = category;
        }).catch(error => console.error("An error occurred:", error));
    console.log(newTodo);
    todoList.push(newTodo);
    updateJSONbin();
    updateTodoList();
};

async function categorizeTask(taskDescription) {
    const apiKey = "";
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";

    const requestBody = {
        messages: [
        { role: "system", content: "You are an assistant that classifies tasks as 'University' or 'Private'." },
        { role: "user", content: `Classify the following task as either 'University' or 'Private' using one word: "${taskDescription}"` }
        ],
        model: "llama3-8b-8192"
    };

    try {
        const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const category = data.choices[0].message.content.trim(); // Adjust based on response structure
        console.log("Categorized as:", category);
        return category;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
  
init();