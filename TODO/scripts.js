"use strict"
let todoList = []; //declares a new array for Your todo list

//initList();

const BIN_ID = "672108bead19ca34f8c0933e"

const Master_Key = ""

let init = function() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            // console.log(req.responseText);
            todoList = JSON.parse(req.responseText).record;
            if (todoList.dupa === "dupa")
                todoList = []
            console.log(todoList)
        }
    };

    req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, true);
    req.setRequestHeader("X-Master-Key", `${Master_Key}`);
    req.send();
}

init();

let updateJSONbin = function() {
    // ciało funkcji na podstawie https://jsonbin.io/api-reference/bins/update
    // UWAGA: ta funkcja zastepuje całą zawartość bina
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
    }
    };

    req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", `${Master_Key}`);
    let dupa 
    console.log(todoList)
    if (todoList.length) {
        dupa = todoList 
    } else {
        dupa = {};
        dupa.dupa= "dupa"
    }
    req.send(JSON.stringify(dupa));
}


let updateTodoList = function() {
    //add all elements
    let filterInput = document.getElementById("inputSearch");   
    const tableBody = document.querySelector('#json-table tbody');

    // Clear any existing rows
    tableBody.innerHTML = '';
    for (let todo in todoList) {
        if (
            (filterInput.value == "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ) {
            const row = document.createElement('tr');

            const title = document.createElement('td');
            const description = document.createElement('td');
            const place = document.createElement('td');
            const dueDate = document.createElement('td');
        
            title.textContent = todoList[todo].title;
            description.textContent = todoList[todo].description;
            place.textContent = todoList[todo].place;
            dueDate.textContent = todoList[todo].dueDate;
            
            row.appendChild(title);
            row.appendChild(description);
            row.appendChild(place);
            row.appendChild(dueDate);

            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click",
                function() {
                    deleteTodo(todo);
                });
            row.append(newDeleteButton)

            tableBody.appendChild(row);

            }
        }
    }

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
    //get the elements in the form
      let inputTitle = document.getElementById("inputTitle");
      let inputDescription = document.getElementById("inputDescription");
      let inputPlace = document.getElementById("inputPlace");
      let inputDate = document.getElementById("inputDate");
    //get the values from the form
      let newTitle = inputTitle.value;
      let newDescription = inputDescription.value;
      let newPlace = inputPlace.value;
      let newDate = new Date(inputDate.value);
    //create new item
      let newTodo = {
          title: newTitle,
          description: newDescription,
          place: newPlace,
          category: '',
          dueDate: newDate
      };
    //add item to the list
    todoList.push(newTodo);
    updateJSONbin();
  }
