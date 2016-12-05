const React = require('react');
const ReactDOM = require('react-dom');
const Grid = require('../util/grid');


module.exports = React.createClass({

  componentDidMount(){
    let text = document.getElementById("text" + this.props.text.index);
    text.style.top = this.props.text.top;
    text.style.fontSize = this.props.text.size + "pt";
    let grid = new Grid();
    grid.alignTop( text, this.props.text.top );
  },

  rule(){
    if( this.props.text.direction === "left" ){
      return( <div className = "leftRule"/> );
    }else{
      return( <div className = "rightRule"/> );
    }
  },

  render(){
    return(
      <div className = "text1" id = { "text" + this.props.text.index  } >
        {
          this.props.text.text
        }
        {
          this.rule()
        }
      </div>
    )
  }
})
