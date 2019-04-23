
function sendnum(){
    var num=document.getElementById("uname").value;
    var xmlhttp;
    var p;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", "/web3/sendnum?num=" + num, true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var tt=JSON.parse(xmlhttp.responseText);
            document.getElementById("answer").innerHTML = (tt["text"]);
            p = (tt["flag"]);
        }
    };
    xmlhttp.send();

    let warn = alert;

    window.alert = (t) => {
        if(confirm(p)) warn("TTCTF NB");
    };
}


