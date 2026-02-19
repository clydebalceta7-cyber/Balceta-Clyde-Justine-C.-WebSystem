let attendance = []; 

$('#addStudent').click(function(){

  let first = $('#firstName').val().trim();
  let middle = $('#middleInitial').val().trim();
  let last = $('#lastName').val().trim();
  let age = $('#age').val().trim();
  let email = $('#EmailCA').val().trim();

  
  $('input').removeClass('error');

  let hasError = false;

  if(first === ''){
    $('#firstName').addClass('error');
    hasError = true;
  }

  if(last === ''){
    $('#lastName').addClass('error');
    hasError = true;
  }

  if(age === ''){
    $('#age').addClass('error');
    hasError = true;
  }

  if( email === ''){
    $('#EmailCA').addClass('error');
    hasError = true;
  }

  if(hasError) return;

  let student = {
    firstName: first,
    middleInitial: middle,
    lastName: last,
    age: age,
    email: email
  };

  attendance.push(student);

  renderList();

  $('#firstName, #middleInitial, #lastName, #age, #EmailCA').val('');
});

function renderList(){
  $('#list').empty();

  attendance.forEach((s, index)=>{
    let name = s.firstName + ' ';
    if(s.middleInitial) name += s.middleInitial + '. ';
    name += s.lastName;

    $('#list').append(
      "<li>" + name + " - Age " + s.age + " - Email " + s.email + "</li>"
    );

  });
}
