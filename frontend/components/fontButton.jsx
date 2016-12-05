const React = require('react');
const ReactDOM = require('react-dom');
const fontActions = require('../actions/fontActions');
const TrueTypeFont = require( '../util/true_type_font' );
let base64 = require('../util/base64');

module.exports = React.createClass({
  componentDidMount(){

  },
  alertAuthorities(){
    let head = document.getElementById("shutter31");
    head.style.width = "200px";
    console.log("alert Authorities");
    let a = atob(this.props.font.file);
    let buffer = base64.convert( a );
    let ttf = new TrueTypeFont( buffer );
    this.props.callback( ttf );
  },

  render(){
      return(
        <div onClick = {this.alertAuthorities} className = "fontButton">
          {this.props.font.name}
        </div>
      )
  }
})
