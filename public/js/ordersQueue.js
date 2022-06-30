
// Ajax request
function updateUnUsedQueue() {
  $.getJSON('/getAllUnUsedQueue', (data) => {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( '<tr id="'+val.code+'"><td></td><td>'+val.code+'</td><td>'+val.description+'</td><td>Comprado</td><td>'+val.createdAt+'</td></tr>' );
    });
    $("#allOrdersUnUsedQueue").html(items.join(""));
  });
}

// Update Display
updateUnUsedQueue();


$(document).ready(function () {
    var table = $('#allOrders').DataTable({
      order: [[3, 'desc']],
      paging: false,
      searching: false,
      ordering: false
    });

});

// Update Table
$('.header').on('click', '#updateTableUnUsedQueue', function() {
  updateUnUsed();
});
