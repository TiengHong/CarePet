//검색기능
function filter() {

  var value, name, item, i;

  value = document.getElementById("value").value.toUpperCase();
  item = document.getElementsByClassName("item");

  for (i = 0; i < item.length; i++) {
    name = item[i].getElementsByClassName("name");
    loc = item[i].getElementsByClassName("location");
    if (name[0].innerHTML.toUpperCase().indexOf(value) || loc[0].innerHTML.toUpperCase().indexOf(value) > -1) {
      item[i].style.display = "flex";
    } else {
      item[i].style.display = "none";
    }
    
  }
}


let wrap = document.getElementById('wrap');
let modal=document.getElementById('modal');
let modalbg=document.getElementById('modal-bg');
let modalbtn=document.querySelectorAll(".modalbtn");
console.log(modalbtn);

// function popOpen(){
//   modalbg.style.display='block';
// }

function popClose(){
//   var modalPop=('.modal-wrap');
//   var modalBg=('.modal-bg');

//   $(modalPop).hide();
//   (modalbg).hide();
//   $('html').removeAttr('style');
  wrap.style.display='none';
}

function putDetailInfo(id){
  fetch('/detail/'+id)
    .then(response => response.json())
    .then(info => {
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0');
      document.getElementById("detail_info").innerHTML = 
      "<li>" + info.c_name+ "</li>"+
      "<li>" + info.c_address+ "</li>"+
      "<li>" + info.c_phone + "</li>"+
      "<li>" + info.c_animal+ "</li>"+
      "<li>" + info.c_content+ "</li>"+
      '<input type="date" id="applydate"  value=' + date +'>' + //info.v_id => date
      '<input type="hidden" id="idx" value=' + info.v_id + '>'
      ;
      wrap.style.display='block';
    });
}

function callSubmit() {
  console.log(document.querySelector("#applydate"));
  window.location.href = "/applyvolunteer/"+document.getElementById("idx").value+'?date='+document.querySelector("#applydate").value;
}

modal.addEventListener('click', function(event){
  // url http://localhost:3000/ 호출 해서 이 값을 변수에 저장
  // 받아들인 데이터를 javascript를 이용해서 rendering
  wrap.style.display='block';
  console.log("Okay");
});


/*
for(let i=0; i<modalbtn.length; i++){
  modalbtn[i].addEventListener('click', putDetailInfo(i+1));
}
*/



