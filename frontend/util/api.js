module.exports = {
  getChoiceFonts: function( func ){
    $.ajax({
      url: "fonts",
      method: "GET",
      error(err){
        debugger
      },
      success(data){
        func( data );
      }
    });
  }
}
