if ($('.product').length == 0) {
  $('.cart-container .cart').hide();
  $('.cart-container .empty').show();
}

$('.cart-container').on('mousemove', function (evt) {
  var windowWidth = $(window).width();
  var cartWidth = $('.product').length * 200;
  if (windowWidth < cartWidth)
  $('.cart').stop(false, true).animate({ left: -(evt.clientX / windowWidth) * (cartWidth - windowWidth) });
  else
  $('.cart').stop(false, true).css({left: 0 });
});

// Sounds
var audioAdd = document.getElementById("ASong").children[0];
var audioError = document.getElementById("ASong").children[1];
var audioCashRegister = document.getElementById("ASong").children[2];
var audioTrash = document.getElementById("ASong").children[3];
var backOrder = document.getElementById("ASong").children[4];
audioAdd.pause();
audioError.pause();
audioCashRegister.pause();
audioTrash.pause();
backOrder.pause();

// Add product on cart
function add(content){

  var contentParts = content.split("|");
  var code = contentParts[0];
  var product = contentParts[1];
  var title = contentParts[2];

  var price = "0";
  var image = "";

  if(product=="Crepe"){
    var categoryProduct = 1;
    price = "7.00";
    image = "images/crepe.jpg";
  }

  if( $('#'+categoryProduct+'_'+code).length==0){
    $(".cart").append('<li id="'+categoryProduct+'_'+code+'" title="'+title+'" class="product" data-price="'+price+'" data-quantity="1"><div class="product-preview"><div class="thumbnail"><img class="image" src="'+image+'" /></div><div class="product-paper"><div class="product-name">'+title+'</div><div class="product-price">R$ '+price+'</div></div></div><div class="product-quantity">'+code+'</div><div class="product-interactions"><div class="button del"></div></div></li>');
    updateBill();
    audioAdd.play();
  }else{
    audioError.play();
  }

}

// Update Bill
function updateBill() {
  var subtotal = 0;
  var total = 0;
  $('.product').each(function () {
    subtotal += $(this).data('quantity') * $(this).data('price');
  });
  total = subtotal;
  $('.total .value').text('R$ ' + total.toFixed(2));

  if ($('.product').length > 0) {
    $('.cart-container .cart').show();
    $('.cart-container .empty').hide();
  }else{
    $('.cart-container .cart').hide();
    $('.cart-container .empty').show();
  }
}

// Delete Product
$('.cart').on('click', '.del', function() {
  var product = $(this).closest('.product');
  product.hide('blind', { direction: 'left' }, 500, function () {
    product.remove();
    //updateProduct(product);
    updateBill();
    audioTrash.play();
  });
});

// Send Order
$('.go').click(function () {
  if ($('.product').length > 0) {
    var items = $('.cart').find('li').map(function() {
      var item = { };

      var productParts = this.id.split("_");
      item.category = productParts[0];
      item.code = productParts[1];
      item.title = this.title;

      $.ajax({
         url: "/order",
         type: "POST",
         dataType: "json",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(item),
         success: function (result) {
           // when call is sucessfull
           //console.log('success');
           //console.log(JSON.stringify(result));

           $( ".product" ).hide('blind', { direction: 'left' }, 500, function () {
             $( ".product" ).remove();
             updateBill();
           });

           $("#div-dialog-success").dialog({
                open: function(event, ui){
                  setTimeout("$('#div-dialog-success').dialog('close')",3000);
                },
                title: "Sucesso!",
                resizable: false,
                height: 180,
                modal: true,
            });

            audioCashRegister.play();
         },
         error: function (err) {
           // check the err for error details
           //console.log('error');

           $("#div-dialog-warning").dialog({
                open: function(event, ui){
                  setTimeout("$('#div-dialog-warning').dialog('close')",2000);
                },
                title: "Erro!",
                resizable: false,
                height: 160,
                modal: true
            });

            audioError.play();
         }
      }); // ajax call closing

    });
  }else{
    audioError.play();
  }
});


$('#btnCancelOrder').click(function () {
  if ($('.product').length > 0) {
    var items = $('.cart').find('li').map(function() {
      var item = { };

      console.log(this.id.split("_"));

      var productParts = this.id.split("_");
      item.category = productParts[0];
      item.code = productParts[1];
      item.title = this.title;

      $.ajax({
         url: "/orderCancel",
         type: "POST",
         dataType: "json",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(item),
         success: function (result) {
           // when call is sucessfull
           //console.log('success');

           $( ".product" ).hide('blind', { direction: 'left' }, 500, function () {
             $( ".product" ).remove();
             updateBill();
           });

           $("#div-dialog-success").dialog({
                open: function(event, ui){
                  setTimeout("$('#div-dialog-success').dialog('close')",3000);
                },
                title: "Pedido Cancelado!",
                resizable: false,
                height: 180,
                modal: true
            });

            backOrder.play();

         },
         error: function (err) {
           // check the err for error details
           //console.log(err);

           $( ".product" ).hide('blind', { direction: 'left' }, 500, function () {
             $( ".product" ).remove();
             updateBill();
           });

           $("#div-dialog-warning").dialog({
                open: function(event, ui){
                  setTimeout("$('#div-dialog-warning').dialog('close')",2000);
                },
                title: "Erro!",
                resizable: false,
                height: 120,
                modal: true
            });

            audioError.play();
         }
      }); // ajax call closing

    });
  }else{
    audioError.play();
  }
});

/*
$('.plus').click(function () {
  var product = $(this).closest('.product');
  var q = product.data('quantity') + 1;
  product.data('quantity', q);
  updateProduct(product);
});

$('.minus').click(function () {
  var product = $(this).closest('.product');
  var q = Math.max(1, product.data('quantity') - 1);
  product.data('quantity', q);
  updateProduct(product);
});

function updateProduct(product) {
  var quantity = product.data('quantity');
  var price = product.data('price');
  $('.product-quantity', product).text('x' + quantity);
  $('.product-price', product).text('R$ ' + (price * quantity).toFixed(2));
  updateBill();
}*/
