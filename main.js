
      function CreateFunction() {
        document.getElementById("demo").innerHTML = "huh";
      }
      function JoinFunction() {
        document.getElementById("demo").innerHTML = "Attempting to Join";
      }
function createBoxTable() {
  var tableData=viewAllBoxes();
  var table = document.createElement('table');
  var tableBody = document.createElement('tbody');

  var row = document.createElement('tr');
  var cell = document.createElement('th');
  cell.appendChild("hello");
  row.appendChild(cell);
  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
      var btn = document.createElement("BUTTON");
      btn.innerHTML = "Want to make a suggestion?";
      btn.class = "delbutton";
      var btnhold = document.createElement('td');
      btnhold.appendChild(btn);
      row.appendChild(btnhold);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}


      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyBJSpeiLpsALteamK8s4i86EPbVARLGLi0",
        authDomain: "suggestion-box-c58b1.firebaseapp.com",
        databaseURL: "https://suggestion-box-c58b1.firebaseio.com",
        projectId: "suggestion-box-c58b1",
        storageBucket: "suggestion-box-c58b1.appspot.com",
        messagingSenderId: "608313282468"
      };
      firebase.initializeApp(config);

      var myDatabase = firebase.database().ref();
      var currUser = document.getElementById('currUser');
      var loginErrorMsg = document.getElementById('error');
      currUser.innerHTML = localStorage.getItem("currUsername");
      //var testBig = document.getElementById('testBig');
      //myDatabase.child('users').on('value', snap => testBig.innerText = snap.val());

      function getReload() {
        currUser = localStorage.getItem("currUsername");
      }
/*
      function switchPage(page) {
        localStorage.setItem("currUsername", currUser);
        window.location.href=page;
      }
*/
      function registerUser(uName, pass) {
      	var usersRef = myDatabase.child("users");
      	var newUser = usersRef.child(uName);
        usersRef.orderByChild("username").equalTo(uName).on("value", function(snapshot) {
          if (snapshot.exists()) {
            console.log("Someone with that username already exists!"); //show taken user message
      	    loginErrorMsg.innerHTML = "Someone with that username already exists!";
          } else {
            newUser.set({
          		password: pass,
              username: uName
          	});
            console.log("New user registered"); //take to home page
            //currUser.innerHTML = uName;
            localStorage.setItem("currUsername", uName);
            currUser = localStorage.getItem("currUsername");
	          window.location.href="ListOfBoxes.html";
          }
        });

      }

      function login(uName, pass) {
        var usersRef = myDatabase.child("users");
        usersRef.orderByChild("username").equalTo(uName).on("value", function(snapshot) {
          if (snapshot.exists()) {
            console.log("exists");
            var passWord;
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              passWord = childSnapshot.val();
            });
            if (passWord.password === pass) {
              console.log("Successful Login"); //take to home page
	            localStorage.setItem("currUsername", uName);
	            window.location.href="ListOfBoxes.html";
            } else {
              console.log("Invalid username or password"); //show invalid user/pass message
	            loginErrorMsg.innerHTML = "Invalid username or password";
            }
          } else {
            console.log("Invalid username or password"); //show invalid user/pass message
            loginErrorMsg.innerHTML = "Invalid username or password";
          }
        });
      }


      function logout() {
        //currUser.innerHTML = null;
	      window.location.href="index.html";
      }

      function createBox(t, d) {
        var allBoxesRef = myDatabase.child("suggestion boxes");
        var newBox = allBoxesRef.child(currUser.innerText+":"+t);
        newBox.once("value").then(function(snapshot) {
          if (snapshot.exists()) {
            console.log("A box with this title already exists!") //show error message for user trying to create a box they already have
          } else {
            newBox.set({
              title: t,
              description: d,
              owner: currUser.innerText
            });
            var userRef = myDatabase.child("/users/" + currUser.innerText + "/my boxes");
            userRef.child(t).set({title: t});
          }
        });
      }

function makeProfileTableHTML() {
    var myArray = viewMyBoxes();
    var result = "<table align='center'>";
    result += "<tr> <th>Your Boxes</th> <th></th> </tr>"
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<th>"+myArray[i][j]+"</th>";
        }
        result += "<th><button type='button' id ='delbox' class='delbutton' onclick='document.getElementById(&quot;demo&quot;).innerHTML = BoxCreate()'>Delete</button></th>"
        result += "</tr>";
    }
    result += "</table>";

    return result;
}
function makeBoxTableHTML() {
    var myArray = viewAllBoxes();
    var result = "<table align='center'>";
    result += "<tr> <th>Box Name</th> <th>Description</th> <th>Suggest?</th> </tr>"
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<2; j++){
            result += "<th>"+myArray[i][j]+"</th>";
        }
        result += "<th><button type='button' id ='addSuggestion' onclick='document.getElementById(&quot;demo&quot;).innerHTML"
        result += " = addSuggestion(myArray[i][2],myArray[i][0],&quot;Communist Manifesto&quot;)'>Want to suggest something?</button></th>"
        result += "</tr>";
    }
    result += "</table>";

    return result;
}
function makeSuggestionTableHTML() {
    var myArray = viewSuggestions("Book Fair");
    var result = "<table align='center'>";
    result += "<tr> <th>Suggestion</th> <th>Delete Button</th> </tr>"
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<th>"+myArray[i][j]+"</th>";
        }
        result += "<th><button type='button' id ='delSugg' class='delbutton' onclick='document.getElementById(&quot;demo&quot;).innerHTML = BoxCreate()'>Delete</button></th>"
        result += "</tr>";
    }
    result += "</table>";

    return result;
}
//function addBoxSuggestionButton() {
  //var para = document.createElement("BUTTON");
  //para.innerHTML = "Want to make a suggestion?";
  //document.getElementById("addSuggestion").appendChild(para);
//}

      function deleteBox(t) {
        var allBoxesRef = myDatabase.child("suggestion boxes");
        var newBox = allBoxesRef.child(currUser.innerText+":"+t);
        newBox.once("value").then(function(snapshot) {
          if (snapshot.exists()) {
            newBox.remove();
            var userRef = myDatabase.child("/users/" + currUser.innerText + "/my boxes");
            userRef.child(t).remove();
          } else {
            console.log("This box does not exist") //this error message should be impossible to reach via the website
          }
        });
      }

      /*
      parameters:
        o: owner of the suggestion box you are making a suggestion to
        t: title of the suggestion box you are suggesting to
        s: the contents of the suggestion
      */
      function addSuggestion(o, t, s) {
        var allBoxesRef = myDatabase.child("suggestion boxes");
        var thisBox = allBoxesRef.child(o+":"+t);
        thisBox.once("value").then(function(snapshot) {
          if (snapshot.exists()) {
            thisBox.child("suggestions").push().set({suggestion: s});
          } else {
            console.log("This box does not exist") //this error message should be impossible to reach via the website
          }
        });
      }




      /*
      returns array of suggestions associated with currUser's box with title t
      assumes that the user is logged in and is looking at a valid title, otherwise returnArray is empty
      return array of suggestions in the form of strings
      */
      function viewSuggestions(t) {
        var returnArray = [];
        var boxSugRef = myDatabase.child("suggestion boxes/"+currUser.innerText+":"+t+"/suggestions");
        boxSugRef.once("value").then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var suggestion = childSnapshot.child("suggestion").val();
            returnArray.push(suggestion);
          });
         })
         console.log(returnArray);
      }

      /*shows all boxes for homepage
      READING FROM THE DATABASE
      returnarray[0] = Title
      returnarray[1] = Description
      returnArray[2] = Owner
      */
      function viewAllBoxes() {
        var returnArray = [];
        var allBoxesRef = myDatabase.child("suggestion boxes");
        var index = 0;
        allBoxesRef.once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var boxTitle = childSnapshot.child("title").val();
              var boxDes = childSnapshot.child("description").val();
              var boxOwner = childSnapshot.child("owner").val();
              returnArray.push([boxTitle, boxDes, boxOwner]);
            });
         })
         console.log(returnArray);
         return returnArray;
      }

      /*
      returns a 2D array of currUser's boxes
      returnarray[0] = Title
      returnarray[1] = Description
      */
      function viewMyBoxes() {
        var returnArray = [];
        var allBoxesRef = myDatabase.child("suggestion boxes");
        allBoxesRef.once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var boxTitle = childSnapshot.child("title").val();
              var boxDes = childSnapshot.child("description").val();
              var boxOwner = childSnapshot.child("owner").val();
              if (boxOwner === currUser.innerText) {
                returnArray.push([boxTitle, boxDes]);
              }
            });
         })
         console.log(returnArray);
         return returnArray;
      }

      document.getElementById("curruser").innerHTML=currUser.innerText();
      document.getElementById("tableMaybe").innerHTML = makeProfileTableHTML();
      document.getElementById("myBoxes").innerHTML = makeBoxTableHTML();
      document.getElementById("suggList").innerHTML = makeSuggestionTableHTML();
