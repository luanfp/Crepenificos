if ($('.product').length == 0) {
  $('.orders-container .orders').hide();
  $('.orders-container .empty').show();
}

// Sounds
var audioAdd = document.getElementById("ASong").children[0];
var audioError = document.getElementById("ASong").children[1];
var audioCashRegister = document.getElementById("ASong").children[2];
var audioTrash = document.getElementById("ASong").children[3];
audioAdd.pause();
audioError.pause();
audioTrash.pause();
audioCashRegister.pause();

// Ajax request
function updateUnUsed() {
  $.getJSON('/getAllUnUsed', (data) => {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( '<tr id="'+val.code+'"><td><button class="ui-button ui-widget ui-corner-all">Incluir na Fila</button></td><td>'+val.code+'</td><td>'+val.description+'</td><td>Comprado</td><td>'+val.createdAt+'</td></tr>' );
    });
    $("#allOrdersUnUsed").html(items.join(""));
  });
}
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

      items.push( '<li id="'+categoryProduct+'_'+val.code+'" title="Colocar em Produção" class="product" data-price="'+price+'" data-quantity="1"><div class="product-preview"><div class="thumbnail"><img class="image" src="'+image+'" /></div><div class="product-paper"><div class="product-name">'+val.description+'</div></div></div><div class="product-quantity">'+val.code+'</div><div class="product-interactions"><div class="button btnInProgress"></div></div></li>' );

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

      items.push( '<li id="'+categoryProduct+'_'+val.code+'" title="'+val.description+'" class="product" data-price="'+price+'" data-quantity="1"><div class="product-preview"><div class="thumbnail"><img class="image" src="'+image+'" /></div><div class="product-paper"><div class="product-name">'+val.description+'</div></div></div><div class="product-quantity">'+val.code+'</div><div class="product-interactions">'+btnAction+'</div></li>' );

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

      items.push( '<li id="'+categoryProduct+'_'+val.code+'" title="'+val.description+'" class="product" data-price="'+price+'" data-quantity="1"><div class="product-preview"><div class="thumbnail"><img class="image" src="'+image+'" /></div><div class="product-paper"><div class="product-name">'+val.description+'</div></div></div><div class="product-quantity">'+val.code+'</div><div class="product-interactions">'+btnAction+'</div></li>' );

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
updateUnUsed();
updateInQueue();
updateInProgress();
updateInDelivery();

$(document).ready(function () {
    var table = $('#allOrders').DataTable({
      order: [[3, 'desc']]
    });

});

function addInQueue(code){
  var code = code;
  console.log("Enviar Produto para 'Fila':"+code);

  var obj = { 'code' : code };
  console.log(obj);

  $.ajax({
     url: "/orderPutInQueue",
     type: "POST",
     contentType: 'application/json',
     data: JSON.stringify(obj),
     success: function (result) {
       console.log('success on orderPutInQueue');
       //console.log(JSON.stringify(result));

       $("#div-dialog-success").dialog({
            open: function(event, ui){
              updateUnUsed();
              updateInProgress();
              updateInQueue();
              setTimeout("$('#div-dialog-success').dialog('close')",1000);
            },
            title: "Sucesso!",
            resizable: false,
            height: 180,
            modal: true,
        });

     },
     error: function (err) {
       // check the err for error details
       console.log('error on orderPutInQueue');

       $("#div-dialog-warning").dialog({
            open: function(event, ui){
              updateUnUsed();
              updateInProgress();
              updateInQueue();
              setTimeout("$('#div-dialog-warning').dialog('close')",3000);
            },
            title: "Erro!",
            resizable: false,
            height: 160,
            modal: true
        });

        audioError.play();
     }
  }); // ajax call closing

}

// Add to Queue
$('#allOrders tbody').on('click', 'button', function () {
    var code = $(this).parents('tr').attr("id");
    console.log("Code: " + code);
    addInQueue(code);
});


// InProgress Product
$('.orders').on('click', '.btnInProgress', function() {
  var product = $(this).closest('.product');
  var productParts = product.attr('id').split("_");
  var category = productParts[0];
  var code = productParts[1];
  console.log("Enviar Produto para 'Em Progresso':"+code);

  var obj = { 'code' : code };
  console.log(obj);

  $.ajax({
     url: "/orderPutInProgress",
     type: "POST",
     contentType: 'application/json',
     data: JSON.stringify(obj),
     success: function (result) {
       console.log('success on orderPutInProgress');
       //console.log(JSON.stringify(result));

       $("#div-dialog-success").dialog({
            open: function(event, ui){
              updateInQueue();
              updateInProgress();
              setTimeout("$('#div-dialog-success').dialog('close')",1000);
            },
            title: "Sucesso!",
            resizable: false,
            height: 180,
            modal: true,
        });

     },
     error: function (err) {
       // check the err for error details
       console.log('error on orderPutInProgress');

       $("#div-dialog-warning").dialog({
            open: function(event, ui){
              updateInQueue();
              updateInProgress();
              setTimeout("$('#div-dialog-warning').dialog('close')",3000);
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

// Done Product
$('.orders').on('click', '.btnDoneProgress', function() {
  var product = $(this).closest('.product');
  var productParts = product.attr('id').split("_");
  var category = productParts[0];
  var code = productParts[1];
  console.log("Marcar Produto como 'Concluído':"+code);

  var obj = { 'code' : code };
  console.log(obj);

  $.ajax({
     url: "/orderPutDone",
     type: "POST",
     contentType: 'application/json',
     data: JSON.stringify(obj),
     success: function (result) {
       console.log('success on orderPutDone');
       //console.log(JSON.stringify(result));

       $("#div-dialog-success").dialog({
            open: function(event, ui){
              updateInProgress();
              updateInDelivery();
              setTimeout("$('#div-dialog-success').dialog('close')",1000);
            },
            title: "Sucesso!",
            resizable: false,
            height: 180,
            modal: true,
        });

     },
     error: function (err) {
       // check the err for error details
       console.log('error on orderPutDone');

       $("#div-dialog-warning").dialog({
            open: function(event, ui){
              updateInProgress();
              updateInDelivery();
              setTimeout("$('#div-dialog-warning').dialog('close')",3000);
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

// Delivered Product
$('.orders').on('click', '.btnDelivered', function() {
  var product = $(this).closest('.product');
  var productParts = product.attr('id').split("_");
  var category = productParts[0];
  var code = productParts[1];
  console.log("Marcar Produto como 'Entregue':"+code);

  var obj = { 'code' : code };
  console.log(obj);

  $.ajax({
     url: "/orderPutDelivered",
     type: "POST",
     contentType: 'application/json',
     data: JSON.stringify(obj),
     success: function (result) {
       console.log('success on orderPutDelivered');
       //console.log(JSON.stringify(result));

       $("#div-dialog-success").dialog({
            open: function(event, ui){
              updateInDelivery();
              setTimeout("$('#div-dialog-success').dialog('close')",1000);
            },
            title: "Sucesso!",
            resizable: false,
            height: 180,
            modal: true,
        });

     },
     error: function (err) {
       // check the err for error details
       console.log('error on orderPutDelivered');

       $("#div-dialog-warning").dialog({
            open: function(event, ui){
              updateInDelivery();
              setTimeout("$('#div-dialog-warning').dialog('close')",3000);
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

// Update Table
$('.header').on('click', '#updateTableUnUsed', function() {
  updateUnUsed();
});

// Update Table
$('.header').on('click', '#updateAllBlc', function() {
  updateInQueue();
  updateInProgress();
  updateInDelivery();
});
