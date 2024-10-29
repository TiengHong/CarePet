function putDetailInfo(id){
    fetch('/detail/'+id)
      .then(response => response.json())
      .then(info => {
        document.getElementById("detail_info").innerHTML = 
        "<li>" + info.user_name+ "</li>"+
        "<li>" + info.user_id+ "</li>"+
        "<li>" + info.user_id + "</li>"+
        "<li>" + info.user_phonenum + "</li>"+
        "<li>" + info.user_birth+ "</li>"+
        '<input type="hidden" id="idx" value=' + info.v_id +'>'
        ;
      });
  }


