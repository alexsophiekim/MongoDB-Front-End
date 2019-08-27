let serverURL;
let serverPort;
let editing = false;

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
        // console.log(data);
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i].name);
          let layout = `<li class="list-group-item productItem" data-id="${data[i]._id}">
            <span class="productName">${data[i].name}</span>
            <div class="btnSet d-flex float-right">
              <button class="btn btn-primary btn-sm mr-1 editBtn">EDIT</button>
              <button class="btn btn-secondary btn-sm removeBtn">REMOVE</button>
            </div>
          </li>`;
          $("#productList").append(layout)
        }
      },
      error: function(err){
            console.log(err);
            console.log('something went wrong');
        }
  });
};

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

$("#productList").on('click','.removeBtn', function(){
  event.preventDefault();
  const id = $(this).parent().parent().data('id');
  const li = $(this).parent().parent();
  $.ajax({
    url:`${serverURL}:${serverPort}/products/${id}`,
    type:'DELETE',
    success: function(result){
      console.log('Deleted');
      // const allProducts = $('.productName');
      // allProducts.each(function(){
      //   if ($(this).data('id') === id) {
      //     $(this).remove();
      //   }
      // })
      li.remove();
    },
    error: function(err){
      console.log(err);
    }

  })
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
