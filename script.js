window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB; 
let db;
var firstName = document.getElementById("firstName")
var lastName = document.getElementById("lastName")
var city = document.getElementById("city")
var mobile = document.getElementById("mobile")
var id = document.getElementById("search")
var data = document.getElementById("data")

var uKey = document.getElementById("uKey")
var uFirstName = document.getElementById("uFirstName")
var uLastName = document.getElementById("uLastName")
var uCity = document.getElementById("uCity")
var uMobile = document.getElementById("uMobile")

document.getElementById("addBtn").addEventListener("click", addStudents)
document.getElementById("clearBtn").addEventListener("click", clearInput)
document.getElementById("searchBtn").addEventListener("click", viewStudent)
document.getElementById("deleteBtn").addEventListener("click", deleteStudent)
document.getElementById("showAllBtn").addEventListener("click", showAllStudent)
document.getElementById("updateBtn").addEventListener("click", updateStudent)

if (!window.indexedDB) {
    alert("Your browser doesn't support IndexedDB");
} else {
    const dbName = "students"
    const dbVersion = 1

    const request = indexedDB.open(dbName, dbVersion)
    //upgrade needed
    request.onupgradeneeded = e =>{
        console.log(`upgrade database name: ${dbName} version: ${dbVersion}`)
        db = e.target.result
        const personalNote = db.createObjectStore("personal_details", {keyPath: "key", autoIncrement: true })
        console.log(`${personalNote.name} is created`)
    }
    // on success
    request.onsuccess = e =>{
        console.log(`successfully open database name: ${dbName} version: ${dbVersion}`)
        db = e.target.result
        showAllStudent()
    }
    //on error
    request.onerror = e =>{
        alert(`Error! ${e.target.error}`)
    }
}

function viewStudent() {
    const tx = db.transaction(["personal_details"], "readwrite")
    const request = tx.objectStore("personal_details").get(parseInt(id.value))
    request.onsuccess = e =>{
        const r = request.result
        if(r!=null) {
            firstName.value = r.firstName
            lastName.value = r.lastName
            city.value = r.city
            mobile.value = r.mobile
        } else {
            clearInput()
            alert("Record does not exist.")
        }
    }
}

function deleteStudent() {
    db.transaction(["personal_details"], "readwrite").objectStore("personal_details").delete(parseInt(id.value));
    console.log("Record delete successfully")
    clearInput() 
    showAllStudent()
}

function addStudents() {
    const student = {
        firstName: firstName.value,
        lastName: lastName.value,
        city: city.value,
        mobile: mobile.value
    }
    const tx = db.transaction(["personal_details"], "readwrite")
    tx.objectStore("personal_details").add(student)
    console.log("Data store successfully...")
    clearInput()
    showAllStudent()
}

function updateStudent() {
    const student = {
        key: parseInt(uKey.value),
        firstName: uFirstName.value,
        lastName: uLastName.value,
        city: uCity.value,
        mobile: uMobile.value
    }
    const tx = db.transaction(["personal_details"], "readwrite")
    const objectStore = tx.objectStore("personal_details")
    const request = objectStore.get(student.key)
    request.onsuccess = function (event) {    
        objectStore.put(student);
        console.log('Data Updated Successfully !!!');  
    };
    clearInput()
    showAllStudent()
}

function showAllStudent() {
    var request = db.transaction(["personal_details"], "readonly").objectStore("personal_details").getAll();  
    request.onsuccess = function (event) {  
        var obj = request.result  
        var table = '<table><thead> <th>ID</th> <th>First Name</th> <th>Last Name</th>  <th>City</th> <th>Mobile</th> </thead><tbody>';  
        for(let i=0; i<obj.length; i++){
            table += '<tr><td>' + obj[i].key + '</td> <td>' + obj[i].firstName + '</td>  <td>' + obj[i].lastName + '</td>  <td>' + obj[i].city + '</td>  <td>' + obj[i].mobile + '</td></tr>';  
        }
        table += '</tbody></table>';  
        data.innerHTML = table
    };  
}

function clearInput() {
    firstName.value = ""
    lastName.value = ""
    city.value = ""
    mobile.value = ""
    id.value = ""
    uFirstName.value = ""
    uLastName.value = ""
    uMobile.value = ""
    uCity.value = ""
    uKey.value = ""
}

