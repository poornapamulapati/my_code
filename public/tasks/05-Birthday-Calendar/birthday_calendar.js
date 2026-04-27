// Birthday calendar with messages
const birthdays = [
    { name: "You", month: 8, day: 31, message: "Happy Birthday! 🎉 Wishing you a wonderful day filled with joy and celebration!" },
    { name: "Friend", month: 3, day: 15, message: "Hey buddy! Another year older and you're still not as cool as me! 😄 Happy Birthday! 🎂" },
    { name: "Best Friend", month: 7, day: 22, message: "Congrats on surviving another year! We're all so proud of you! 🎈 Happy Birthday!" },
    { name: "Sister", month: 5, day: 10, message: "Happy Birthday! Don't worry, you're still younger than you will be next year! 😉" }
];

function displayTodayMessage() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const messageDiv = document.getElementById("message");
    const birthday = birthdays.find(b => b.month === month && b.day === day);
    
    if (birthday) {
        if (birthday.name === "You") {
            messageDiv.style.backgroundColor = "#FFD700";
            messageDiv.innerHTML = birthday.message;
        } else {
            messageDiv.style.backgroundColor = "#FFC0CB";
            messageDiv.innerHTML = `<strong>${birthday.name}'s Birthday:</strong> ${birthday.message}`;
        }
    } else {
        messageDiv.style.backgroundColor = "#f0f0f0";
        messageDiv.innerHTML = "No birthdays today. Check another date!";
    }
}

function checkBirthday() {
    const dateInput = document.getElementById("dateInput").value;
    
    if (!dateInput) {
        alert("Please select a date!");
        return;
    }
    
    const selectedDate = new Date(dateInput);
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    
    const messageDiv = document.getElementById("message");
    const birthday = birthdays.find(b => b.month === month && b.day === day);
    
    if (birthday) {
        if (birthday.name === "You") {
            messageDiv.style.backgroundColor = "#FFD700";
            messageDiv.innerHTML = birthday.message;
        } else {
            messageDiv.style.backgroundColor = "#FFC0CB";
            messageDiv.innerHTML = `<strong>${birthday.name}'s Birthday:</strong> ${birthday.message}`;
        }
    } else {
        messageDiv.style.backgroundColor = "#f0f0f0";
        messageDiv.innerHTML = "No birthdays on this date!";
    }
}

window.onload = function() {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById("currentDate").textContent = dateString;
    displayTodayMessage();
};