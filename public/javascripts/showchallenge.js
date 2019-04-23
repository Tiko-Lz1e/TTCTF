$(document).ready(function() {

    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);// Button that triggered the modal
        var recipient = button.data('whatever');
        var xmlhttp;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET","/challenge/question?id="+recipient,true);

        var modal = $(this);

        document.getElementById("flagid").value=recipient;


        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState===4 && xmlhttp.status===200)
            {
                var tt=JSON.parse(xmlhttp.responseText);
                modal.find('.modal-title').text(tt["title"]);
                modal.find('.modal-body #message').text(tt["text"]);
                modal.find('.modal-body #answer').text(tt["answer"]);
                modal.find('.modal-body #qespoint').text(tt["point"]+'point');
                document.getElementById("qeslink").href=(tt["link"]);
                console.log(tt["link"]);
            }
        };
        xmlhttp.send();
    });

});

function sendflag(){
    var questionnum=2;
    var flag=document.getElementById("flagtext").value;
    var id=document.getElementById("flagid").value;
    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    if(id<=questionnum) {
        xmlhttp.open("GET", "/challenge/sendflag?flagid=" + id + "&flagtext=" + flag, true);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                document.getElementById("answer").innerHTML = xmlhttp.responseText;
            }
        };
        xmlhttp.send();
    }
    else{
        alert("真的没有这道题啦，不要再试了！o(￣ヘ￣o＃)");
    }
}



