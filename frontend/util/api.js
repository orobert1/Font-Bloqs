module.exports = {
  getChoiceFonts: function( func ){
    $.ajax({
      url: "fonts",
      method: "GET",
      error(err){

      },
      success(data){
        func( data );
      }
    });
  }
}
