let serverURL;
let serverPort;
let url;
let editing = false;

$.ajax({
  url:'config.json',
  type:'GET',
  dataType:'json',
  success:function(keys){
    // console.log(keys);
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
    getProductsData();
  },
  error:function(err){
    console.log('error');
  }
})

getProductsData = ()=> {
  $.ajax({
      url: `${serverURL}:${serverPort}/allProducts`,
      dataType: 'json',
      type:'GET',
      success: function(data){
        // console.log(data);
        $('#productList').empty();
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i].name);
          let layout = `<li class="list-group-item productItem" data-id="${data[i]._id}">
            <span class="productName">${data[i].name}</span>`
            if (sessionStorage['userName']) {
              layout += `<div class="btnSet d-flex float-right">
                          <button class="btn btn-primary btn-sm mr-1 editBtn">EDIT</button>
                          <button class="btn btn-secondary btn-sm removeBtn">REMOVE</button>
                        </div>`
            }
              layout += `</li>`;
          $("#productList").append(layout)
        }
      },
      error: function(err){
            console.log(err);
            console.log('something went wrong');
        }
  });
};

$("#addBtn").click(function(){
  event.preventDefault();   //prevent refresh form
  let name = $("#productName").val();
  let price = $("#productPrice").val();
  if ((name.length === 0) || (price.length === 0)) {
    console.log('input product name and price');
  } else {
    if (editing ===true) {
      const id = $("#productID").val();
      $.ajax({
        url: `${serverURL}:${serverPort}/editProduct/${id}`,
        type: 'PATCH',
        data: {
          name: name,
          price: price
         },
        success: function(result){
          $("#productName").val(null);
          $("#productPrice").val(null);
          $("#productID").val(null);
          $("#addBtn").text('Add New Product').removeClass('btn-warning');
          $("#heading").text('Add New Product');
          editing = false;
          const allProducts = $('.productItem');
          console.log(allProducts);
          allProducts.each(function(){
            console.log($(this).data('id'));
            if ($(this).data('id') === id) {
              console.log('match');
                $(this).find('.productName').text(name);
            }
          });
        },
        error: function(err) {
          console.log(err);
          console.log('something went wrong with editing the product');
        }
      })
    } else {
     console.log(`${name} - $${price}`);
     $.ajax({
       url:  `${serverURL}:${serverPort}/product`,
       type: 'POST',
       data: {
         name: name,
         price: price
       },
       success: function(result){
         $("#productName").val(null);
         $("#productPrice").val(null);
         $("#productList").append(`<li class="list-group-item productItem">
         <span class="productName">${result.name}</span>
          <div class="btnSet d-flex float-right">
            <button type="button" class="btn btn-primary btn-sm mr-1 editBtn">EDIT</button>
            <button type="button" class="btn btn-secondary btn-sm removeBtn">REMOVE</button>
           </div>
          </li>`);
        },
       error: function(error){
         console.log(error);
         console.log('something went wrong with sending the data');
       }
     })
   }
  }
});

$("#productList").on('click', '.editBtn', function() {
  event.preventDefault();
  const id = $(this).parent().parent().data('id');
  console.log(id);
  console.log('button has been clicked');
  $.ajax({
    url:`${serverURL}:${serverPort}/product/${id}`,
    type: 'GET',
    dataType:'json',
    success: function(product){
      console.log(product);
      $("#productName").val(product['name']);
      $("#productPrice").val(product['price']);
      $("#productID").val(product['_id']);
      $("#addBtn").text('Edit Product').addClass('btn-warning');
      $("#heading").text('Edit Product');
      editing = true;
    },
    error: function(){
      console.log(err);
      console.log('something went wrong with getting the single product');
    }
  })
});

$("#productList").on('click','.removeBtn', function(){
  event.preventDefault();
  const id = $(this).parent().parent().data('id');
  const li = $(this).parent().parent();
  $.ajax({
    url:`${url}/products/${id}`,
    type:'DELETE',
    success: function(result){
      console.log('Deleted');
      li.remove();
    },
    error: function(err){
      console.log(err);
    }
  })
});

$('#loginTabBtn').click(function(){
    event.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('#loginForm').show();
    $('#registerForm').hide();
});

$('#registerTabBtn').click(function(){
    event.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('#loginForm').hide();
    $('#registerForm').removeClass('d-none').show();
});

$('#registerForm').submit(function(){
  event.preventDefault();
  // console.log('register has been clicked');
  let username = $('#rUsername').val();
  let email = $('#rEmail').val();
  let password = $('#rPassword').val();
  let confirmPassword = $('#rConfirmPassword').val();
  if(username.length === 0){
        console.log('please enter a username');
    } else if(email.length === 0){
        console.log('please enter an email');
    } else if(password.length === 0){
        console.log('please enter a password');
    } else if(confirmPassword.length === 0){
        console.log('please confirm your password');
    } else if(password !== confirmPassword){
        console.log('your passwords do not match');
    } else {
        // console.log('you are good to go');
        $.ajax({
          url: `${url}/users`,
          type: 'POST',
          data:{
            username: username,
            email:email,
            password:password
          },
          success:function(result){
            console.log(result);
          },
          error: function(err){
              console.log(err);
              console.log('something went wrong with registering a new user');
          }
        });
    }
});

$('#loginForm').submit(function(){
    event.preventDefault();
    let username = $('#lUsername').val();
    let password = $('#lPassword').val();
    if(username.length === 0){
      console.log('please enter a username');
    } else if(password.length === 0){
      console.log('please enter a password');
    } else {
      $.ajax({
        url:`${url}/getUser`,
        type: 'POST',
        data: {
          username:username,
          password:password
        },
        success: function(result){
          if (result === 'Invalid user') {
              console.log('cannot find user with that username');
          } else if (result === 'Invalid password') {
              console.log('Your password is wrong');
          } else {
              console.log('lets log you in');
              console.log(result);
              sessionStorage.setItem('userID',result['_id']);
              sessionStorage.setItem('userName', result['username']);
              sessionStorage.setItem('userEmail', result['email']);
              getProductsData();
              $('#authForm').modal('hide');
              $('#loginBtn').hide();
              $('#logOutBtn').removeClass('d-none');
              $('#addProductSection').removeClass('d-none');
          }
        },
        error: function(err){
          console.log(err);
          console.log('something went wrong');
        }
      })
    }
});

$('#logOutBtn').click(function(){
  sessionStorage.clear();
  getProductsData();
  $('#loginBtn').show();
  $('#logOutBtn').addClass('d-none');
  $('#addProductSection').addClass('d-none');
});

$(document).ready(function(){
  // $('#authForm').modal('show');
  if (sessionStorage['userName']) {
    console.log('you are logged in');
    $('#loginBtn').hide();
    $('#logOutBtn').removeClass('d-none');
    $('#addProductSection').removeClass('d-none');
  } else {
    console.log('please sign in');
  }
  console.log(sessionStorage);
})
