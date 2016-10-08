module.exports = {
  getChoiceFonts: function( func ){
    $.ajax({
      url: "fonts",
      method: "GET",
      success(data){
        func( data );
      }
    });
  }
}
