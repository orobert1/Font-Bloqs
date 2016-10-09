const Dispatcher = require( '../dispatcher/dispatcher' );
const Constants = require( '../constants/constants' );
const api = require('../util/api');

module.exports = {
  getFonts ( func ){
     api.getChoiceFonts( func );
  },
  selectFont: function( ttf ){
    Dispatcher.dispatch({
      actionType: Constants.changeCurrentFont,
      ttf: ttf
    });
  }
}
