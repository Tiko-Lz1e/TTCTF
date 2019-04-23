
function sendnum(){
    var num=document.getElementById("uname").value;
    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", "/web2/index/sendnum?num=" + num, true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            document.getElementById("answer").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.send();
}
