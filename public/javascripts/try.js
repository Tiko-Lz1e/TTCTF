$().ready(function(){
    let warn = alert;

    window.alert = (t) => {
        if(confirm('Who are you?')) warn(t);
    };

    alert('You are so clever.');
});
