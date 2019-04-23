$(document).ready(function() {

    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", "/balabala/list", true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            document.getElementById("balalist").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.send();
});

function sendbala(){
    var bala=document.getElementById("balatext").value;
    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", "/balabala/sendbala?balatext=" + bala, true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            document.getElementById("answer").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.send();
}
