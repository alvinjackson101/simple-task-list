

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
      var objectStore = db.createObjectStore('task', {keyPath: "id", autoIncrement: true}) ;

   }
}

//adds a record as entered in the form
function add() {
   let taskItem = document.querySelector('#taskinput').value;
   console.log(taskItem)
   //alert(id + name + taskinput + age);
   
   //create a transaction and attempt to add data
   var request = db.transaction([ 'task' ], 'readwrite')
   .objectStore('task')
   .add({ task: taskItem, id:new Date().getTime()});

   //when successfully added to the database
   request.onsuccess = function(event) {
      renderTask();
   };

   //when not successfully added to the database
   request.onerror = function(event) {
     console.log(`Unable to add data\r\n${taskinput} is already on your list! `);
   };
	//get a reference to the fields in html
	

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
         var textnode = document.createTextNode(cursor.value.task );   
         var imagenode = document.createElement("IMG");
         imagenode.setAttribute("onclick", `remove(${cursor.value.id})`)
         imagenode.src = 'delte-icon.png';
         node.setAttribute("id", `${cursor.value.id}`)
         node.appendChild(textnode);                              // Append the text to <li>
         node.appendChild(imagenode);
         list.appendChild(node);
         cursor.continue();

      }
   };  
   
}


function remove(id) {
   console.log("Called Remove Function!")
	let delid = document.getElementById(`${id}`).value;
   console.log(delid)
   var request = db.transaction(['task'], 'readwrite')
   .objectStore('task')
   .delete(id);

   renderTask()   
}   

initDatabase();