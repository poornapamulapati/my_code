// the string input as of a string with the words car bat table collage.
//  The output should be bat car college table.
//  To do this first take the input string and then split into word, sort them, combine into sentence, display.

function sortWords() {
    var input = document.getElementById("sortString").value;
    var words = input.split(" ");
    words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    var sortedString = words.join(" ");
    document.getElementById("sortString").value = sortedString;
    document.getElementById("result").innerHTML = "Sorted: " + sortedString;
    console.log(sortedString);
}

document.getElementById("Push").onclick = sortWords;