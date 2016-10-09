let React = require('react');
let ReactDOM = require('react-dom');
let base64 = require('../util/base64');
let binaryReader = require('../util/binary_reader');
let fontActions = require('../actions/fontActions');
let trueTypeFont = require('../util/true_type_font');
const Download = require('../util/download')


module.exports = React.createClass({
  submit(){
    let a = atob(this.props.font);
    let buffer = base64.convert( a );
    let ttf = new trueTypeFont( buffer );
    fontActions.selectFont( ttf );
  },
  render(){
    return(
      <button className = {"font"} onClick={ this.submit }>
        {
          "Benton"
        }
      </button>
    )
  }
})
