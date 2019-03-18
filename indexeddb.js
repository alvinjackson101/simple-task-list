

const list = document.getElementById('listContainer');

//the database reference
let db; 

var counter = 0;

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
	let request = window.indexedDB.open('task', 1);
	request.onerror = function(event) {
		console.log(event);
	};

   //map db to the opening of a database
	request.onsuccess = function(event) { 
		db = request.result;
		console.log('success: ' + db);
      renderTask();

	};

   //if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore('task') ;

   }
}

//adds a record as entered in the form
function add() {

	//get a reference to the fields in html
	let task = document.querySelector('#taskinput').value;
   console.log (task); 

	//alert(id + name + taskinput + age);
   
   //create a transaction and attempt to add data
	var request = db.transaction([ 'task' ], 'readwrite')
	.objectStore('task')
	.add({ task: task, id:new Date().getTime()});

   //when successfully added to the database
	request.onsuccess = function(event) {
		renderTask();
	};

   //when not successfully added to the database
	request.onerror = function(event) {
	console.log(`Unable to add data\r\n${taskinput} is already on your list! `);
	};
}

//not used in code example
//reads one record by id
function renderTask() {
   list.innerHTML='';
   //get a transaction
   var objectStore = db.transaction("task").objectStore("task");

//creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         // alert(" FirstName " + cursor.value.firstname + ", Last Name: " + cursor.value.lastname + ", Email: " + cursor.value.email);
         var node = document.createElement("LI");                 // Create a <li> node
         var textnode = document.createTextNode(cursor.value.task );         // Create a text node
         var imagenode = document.createElement("IMG");
         imagenode.src = 'delte-icon.png';
         node.appendChild(textnode);                              // Append the text to <li>
         node.appendChild(imagenode);
         list.appendChild(node);
         cursor.continue();

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
         // alert(" FirstName " + cursor.value.firstname + ", Last Name: " + cursor.value.lastname + ", taskinput: " + cursor.value.taskinput);
         var node = document.createElement("LI");                 // Create a <li> node
         var textnode = document.createTextNode(cursor.value.task );         // Create a text node
         node.appendChild(textnode);                              // Append the text to <li>
         list.appendChild(node);
         cursor.continue();

      }
   };
}


function remove(item) {
	let delid = document.querySelector("#delid").value;
   var request = db.transaction(['task'], 'readwrite')
   .objectStore('task')
   .delete(delid);
   
  }

initDatabase();