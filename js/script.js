$.ajax({
  url: `http://192.168.33.10:3000/allProducts`,
  dataType: 'json',
  type:'GET',
  success: function(data){
    // console.log(data);
    for (var i = 0; i < data.length; i++) {
      // console.log(data[i].name);
      let layout = `<li class="list-group-item">${data[i].name}
        <div class="btnSet d-flex float-right">
          <button type="button" class="btn btn-primary btn-sm mr-1">EDIT</button>
          <button type="button" class="btn btn-secondary btn-sm ">REMOVE</button>
        </div>
      </li>`
      $("#productList").append(layout);
    }
  },
  error: function(){
    console.log('error');
  }
});

$("#addBtn").click(function(){
  event.preventDefault();   //prevent refresh form
  let name = $("#productName").val();
  let price = $("#productPrice").val();

  if ((name.length === 0) || (price.length === 0)) {
    console.log('input product name and price');
  } else {
    console.log(`${name} - $${price}`);
    $.ajax({
      url: 'http://192.168.33.10:3000/product',
      type: 'POST',
      data: {
        name: name,
        price: price
      },
      success: function(result){
        console.log(result);
      },
      error: function(error){
        console.log(error);
        console.log('something went wrong with sending the data');
      }
    })

  }
});
