let serverURL;
let serverPort;

$.ajax({
  url:'config.json',
  type:'GET',
  dataType:'json',
  success:function(keys){
    // console.log(keys);
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
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
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i].name);
        let layout = `<li class="list-group-item">${data[i].name}
          <div class="btnSet d-flex float-right">
            <button type="button" class="btn btn-primary btn-sm mr-1">EDIT</button>
            <button type="button" class="btn btn-secondary btn-sm ">REMOVE</button>
          </div>
        </li>`
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
        $("#productList").append(`<li class="list-group-item">${name} - $${price}
         <div class="btnSet d-flex float-right">
           <button type="button" class="btn btn-primary btn-sm mr-1">EDIT</button>
           <button type="button" class="btn btn-secondary btn-sm ">REMOVE</button>
          </div>
         </li>`);
       },
      error: function(error){
        console.log(error);
        console.log('something went wrong with sending the data');
      }
    })
  }
});








$("#submit").click(function(){
  console.log('clicked');
  event.preventDefault();
  let username = $("#userName").val();
  let email = $("#email").val();
  let message = $("#messageArea").val();

  if ((username.length === 0)||(email.length === 0)||(message.length === 0)) {
    console.log('input correctly');
  } else {
    console.log(`${username}, ${email} - your message is ${message}`);
    $.ajax({
      url: `${serverURL}:${serverPort}/message`,
      type: 'POST',
      data: {
        username: username,
        email: email,
        message: message
      },
      success: function(result){
        console.log(result);
      },
      error: function(err){
        console.log(err);
        console.log('something went wrong');
      }
    });
  }

});
