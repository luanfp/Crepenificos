if ($('.product').length == 0) {
  $('.orders-container .orders').hide();
  $('.orders-container .empty').show();
}

// Ajax request
function updateInQueue() {
  $.getJSON('/getAllInQueue', (data) => {
    var items = [];
    $.each( data, function( key, val ) {

      var price = "0";
      var image = "";
      if(val.category=="1"){
        var categoryProduct = 1;
        price = "7.00";
        image = "images/crepe.jpg";
      }

      items.push( '<li id="'+categoryProduct+'_'+val.code+'" class="product" data-price="'+price+'" data-quantity="1"><div class="product-preview"><div class="thumbnail"><img class="image" src="'+image+'" /></div><div class="product-paper"><div class="product-name">'+val.description+'</div></div></div><div class="product-quantity">'+val.code+'</div></li>' );

    });
    $("#inqueue").html(items.join(""));

    if ($('#inqueue .product').length > 0) {
      $('.orders-container-queue #inqueue').show();
      $('.orders-container-queue .emptyQueue').hide();
    }else{
      $('.orders-container-queue #inqueue').hide();
      $('.orders-container-queue .emptyQueue').show();
    }

  });
}
function updateInProgress() {
  $.getJSON('/getAllInProgress', (data) => {
    var items = [];
    $.each( data, function( key, val ) {

      var price = "0";
      var image = "";
      if(val.category=="1"){
        var categoryProduct = 1;
        price = "7.00";
        image = "images/crepe.jpg";
      }
      //console.log(val.status);
      var btnAction = "";
      if(val.status=="2"){
        btnAction = '<div class="button btnDoneProgress"></div>';
      }

      items.push( '<li id="'+categoryProduct+'_'+val.code+'" title="'+val.description+'" class="product" data-price="'+price+'" data-quantity="1"><div class="product-preview"><div class="thumbnail"><img class="image" src="'+image+'" /></div><div class="product-paper"><div class="product-name">'+val.description+'</div></div></div><div class="product-quantity">'+val.code+'</div></li>' );

    });
    $("#inprogress").html(items.join(""));

    if ($('#inprogress .product').length > 0) {
      $('.orders-container-progress #inprogress').show();
      $('.orders-container-progress .emptyProgress').hide();
    }else{
      $('.orders-container-progress #inprogress').hide();
      $('.orders-container-progress .emptyProgress').show();
    }

  });
}
function updateInDelivery() {
  $.getJSON('/getAllDone', (data) => {
    var items = [];
    $.each( data, function( key, val ) {

      var price = "0";
      var image = "";
      if(val.category=="1"){
        var categoryProduct = 1;
        price = "7.00";
        image = "images/crepe.jpg";
      }
      //console.log(val.status);
      var btnAction = "";
      if(val.status=="3"){
        btnAction = '<div class="button btnDelivered"></div>';
      }

      items.push( '<li id="'+categoryProduct+'_'+val.code+'" title="'+val.description+'" class="product" data-price="'+price+'" data-quantity="1"><div class="product-preview"><div class="thumbnail"><img class="image" src="'+image+'" /></div><div class="product-paper"><div class="product-name">'+val.description+'</div></div></div><div class="product-quantity">'+val.code+'</div></li>' );

    });
    $("#indelivery").html(items.join(""));

    if ($('#indelivery .product').length > 0) {
      $('.orders-container-delivery #indelivery').show();
      $('.orders-container-delivery .emptyDelivery').hide();
    }else{
      $('.orders-container-delivery #indelivery').hide();
      $('.orders-container-delivery .emptyDelivery').show();
    }

  });
}

// Update Display
updateInQueue();
updateInProgress();
updateInDelivery();

setInterval(function () {
  updateInQueue();
  updateInProgress();
  updateInDelivery();
}, 5000);
