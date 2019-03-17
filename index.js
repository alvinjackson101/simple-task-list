//some sample data
const guestsData = [
   { firstname: "Andy", lastname:"Jack", email: "andy@cool.com", notes:"hello"},
   { firstname: "Mike", lastname:"Larry", email: "mike@cool.com", notes:"hello world"}
];

const list = document.getElementById('listContainer');

//the database reference
let db; 

//initializes the database
function initDatabase() {

	//create a unified variable for the browser variant
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		//if a variant wasn't found, let the user know
	if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}

   //attempt to open the database
	let request = window.indexedDB.open("guest", 1);
	request.onerror = function(event) {
		console.log(event);
	};

   //map db to the opening of a database
	request.onsuccess = function(event) { 
		db = request.result;
		console.log("success: " + db);

	};

   //if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("guest", {keyPath: "email"});
      
      for (var i in guestsData) {
         objectStore.add(guestsData[i]);
      }
   }
}

//adds a record as entered in the form
function add() {
	//get a reference to the fields in html
	let task = document.querySelector("#task").value;

	//alert(id + name + email + age);
   
   //create a transaction and attempt to add data
	var request = db.transaction(["task"], "readwrite")
	.objectStore("task")
	.add({ task: task});

   //when successfully added to the database
	request.onsuccess = function(event) {
		alert(`${task} has been added to your database - UPDATE.`);
	};

   //when not successfully added to the database
	request.onerror = function(event) {
	alert(`Unable to add data\r\n${email} is already in your database! `);
	}
}

//not used in code example
//reads one record by id
function read() {
   //get a transaction
   var transaction = db.transaction(["task"]);
   
   //create the object store
   var objectStore = transaction.objectStore("task");

   //get the data by id
   var request = objectStore.get("00-03");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
         alert(" task " + cursor.value.task + ");
      }
      
      else {
         alert("Task couldn't be found in your database!");
      }
   };
}

//reads all the data in the database
function readAll() {
   var objectStore = db.transaction("task").objectStore("task");
   list.innerHTML="";

   //creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         // alert(" FirstName " + cursor.value.firstname + ", Last Name: " + cursor.value.lastname + ", Email: " + cursor.value.email);
         var node = document.createElement("LI");                 // Create a <li> node
         var textnode = document.createTextNode(cursor.value.task );         // Create a text node
         node.appendChild(textnode);                              // Append the text to <li>
         list.appendChild(node);
         cursor.continue();

      }
   };
}


//deletes a record by id
function remove() {
	let delid = document.querySelector("#delid").value;
   var request = db.transaction(["guest"], "readwrite")
   .objectStore("guest")
   .delete(delid);
   
   request.onsuccess = function(event) {
      alert("Entry has been removed from your database.");
   };
}

initDatabase();