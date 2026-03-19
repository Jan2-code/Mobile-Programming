function calculateResult() {
    let totalMarks =
        Number(document.getElementById("math").value) +
        Number(document.getElementById("science").value) +
        Number(document.getElementById("english").value) +
        Number(document.getElementById("history").value) +
        Number(document.getElementById("geography").value) +
        Number(document.getElementById("computer").value) +
        Number(document.getElementById("art").value) +
        Number(document.getElementById("social").value);

    document.getElementById("Total").innerHTML = "Total Marks: " + totalMarks + "/800";

    if (totalMarks >= 700) {
        document.getElementById("result").innerHTML = "Pass with Distinction";
        document.getElementById("result").style.color = "green";
    } else if (totalMarks >= 600) {
        document.getElementById("result").innerHTML = "First Division";
        document.getElementById("result").style.color = "blue";
    } else if (totalMarks >= 500) {
        document.getElementById("result").innerHTML = "Second Division";
        document.getElementById("result").style.color = "orange";   
    } else if (totalMarks >= 400) {
        document.getElementById("result").innerHTML = "Third Division";
        document.getElementById("result").style.color = "brown";
    } else {    
        document.getElementById("result").innerHTML = "Fail";
        document.getElementById("result").style.color = "red";
    }

}




