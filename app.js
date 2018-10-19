var config = {
    apiKey: "AIzaSyCOGYEImoAWeJLQBcLfqL9lEQgCCD7jZgg",
    authDomain: "trainscheduler-e0021.firebaseapp.com",
    databaseURL: "https://trainscheduler-e0021.firebaseio.com",
    projectId: "trainscheduler-e0021",
    storageBucket: "trainscheduler-e0021.appspot.com",
    messagingSenderId: "550687980951"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var name;
var destination;
var firstTrain;
var frequency = 0;

$("#pageInfo").on("submit", function() {
    event.preventDefault()
    
    name = $("#train").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();
    
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
   
});

database.ref().on("child_added", function(childSnapshot) {
    var nextArr;
    var minAway;
   
    var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
   
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
   
    var minAway = childSnapshot.val().frequency - remainder;
    
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#trainTable > tbody").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain + 
            "</td><td>" + minAway + "</td></tr>");

       
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
});





