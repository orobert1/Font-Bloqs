const React = require('react');
const Grid = require('../util/grid');
const ReactDOM = require('react-dom');

module.exports = React.createClass({
  componentDidMount(){
    let linkToChoose = document.getElementById("linkToChoose");
    let grid = new Grid();
    grid.alignTop( linkToChoose, 10 );
    window.setTimeout( function(){
      linkToChoose.style.transition = ".4s";
    }, 100);
  },
  scroll(){
    $('html, body').animate({scrollTop: $("#instructions").offset().top}, 400);
  },

  render(){
    return(
      <div id = "linkToChoose" onClick = {this.scroll}> Choose A Typeface</div>
    )
  }
})
