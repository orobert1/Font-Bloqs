let React = require('react');
let ReactDOM = require('react-dom');
let base64 = require('../util/base64');

module.exports = React.createClass({
  submit(){
    let buffer = base64.convert( this.props.font.file );
    this.props.callback( buffer );
  },
  render(){
    return(
      <button className = {"font"} onClick={ this.submit }>
        {
          this.props.font.name
        }
      </button>
    )
  }
})
