$(document).ready(function() {

    var xmlhttp;
    xmlhttp=new XMLHttpRequest();

    xmlhttp.open("GET", "/ranklist/list", true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            document.getElementById("ranklist").innerHTML = xmlhttp.responseText;
        }
    };

    xmlhttp.send();

});
