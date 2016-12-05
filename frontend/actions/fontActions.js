const Dispatcher = require( '../dispatcher/dispatcher' );
const Constants = require( '../constants/constants' );
const api = require('../util/api');

module.exports = {
  getFonts (){
     api.getChoiceFonts( this.selectFont );
  },

  getFont( id ){

  },


  selectFont: function( ttf ){
    Dispatcher.dispatch({
      actionType: Constants.changeCurrentFont,
      ttf: ttf
    });
  }
}
