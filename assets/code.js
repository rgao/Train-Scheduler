$(document).ready(function() {

    setInterval(function() {
        $("#real-time").text(moment())
    }, 1000)

    // dynamically update minutes until arrival
    setInterval(function () {
        $(".data-row").each(function () {
            var dynamicMUA = nextTrain($(this).attr("data-init"), this.children[2].textContent);
            this.children[4].textContent = dynamicMUA[0];
        })        
    }, 60000)

    var config = {
        apiKey: "AIzaSyC5xcF9mDRgorYXHdxoXEoHaJoLRzLORSg",
        authDomain: "train-scheduler-1e250.firebaseapp.com",
        databaseURL: "https://train-scheduler-1e250.firebaseio.com",
        projectId: "train-scheduler-1e250",
        storageBucket: "train-scheduler-1e250.appspot.com",
        messagingSenderId: "199574934850"
      };
      
    firebase.initializeApp(config);
    var database = firebase.database();

    var nextTrain = function(initialTime, freq) {
        var initialTime = moment(initialTime, "HH:mm").subtract(1, "years");
        var currentFromInitial = moment().diff(moment(initialTime), "minutes");
        var minutesSinceArrival = currentFromInitial % freq;
        var minutesUntilArrival = freq - minutesSinceArrival;
        var nextArrival = moment(moment().add(minutesUntilArrival, "minutes")).format("HH:mm");
        return [minutesUntilArrival, nextArrival];
    };

    $("#submitButton").on("click", function(event) {
        event.preventDefault();

        database.ref().push({
            name: $("#nameInput").val().trim(),
            destination: $("#destInput").val().trim(),
            start: $("#firstInput").val().trim(),
            frequency: $("#rateInput").val().trim(),
        });

        $("#nameInput").val() = "";
        $("#destInput").val() = "";
        $("#firstInput").val() = "";
        $("#rateInput").val() = "";
    });

    database.ref().on("child_added", function(childSnapshot) {
        var a = [];

        var incomingTrain = nextTrain(childSnapshot.val().start, childSnapshot.val().frequency);
        nextTrainIn = incomingTrain[0];
        nextArrivalTime = incomingTrain[1];

        var newRow = $("<tr class='data-row'>");
        newRow.attr("data-init", childSnapshot.val().start);
        newRow.append(
            "<th scope='row'>" + childSnapshot.val().name +
            "</th></th><td>" + childSnapshot.val().destination +
            "</td><td class='freq'>" + childSnapshot.val().frequency +
            "</td><td>" + nextArrivalTime +
            "</td><td>" + nextTrainIn +
            "</td></tr>"
        );

        $("tbody").append(newRow);
    })
})