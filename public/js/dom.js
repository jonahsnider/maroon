M.AutoInit();

function submitForm() {
  var formData = JSON.stringify($("#myForm").serializeArray());
  $.ajax({
    type: "POST",
    url: "127.0.0.1",
    data: formData,
    success: function(){},
    dataType: "json",
    contentType : "application/json"
  });
}
