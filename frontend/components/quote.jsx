const React = require('react');
const ReactDOM = require('react-dom');
const Grid = require('../util/grid.js');
const checkWindow = require('../util/checkWindow');
const Cloud = require('./cloud');


module.exports = React.createClass({
  componentDidMount(){
    let quote =  document.getElementById("quote");
    quote.style.width = window.innerWidth + "px";
    let poem = document.getElementById("typePoem");
    this.props.win.registerElement( poem, function( el ){
      el.style.transition = "2s";
      el.style.opacity = 1;
    } );

    let grid = new Grid();
    grid.alignLeft( poem, 15 );
    grid.picWidth( poem, 4 );

  },
  render(){
    return(

      <div id = "quote" className = "quote">
        <div className = "buffer"/>
        <div id = "typePoem">
          The First Time I Drew Type, I felt like I was at the bottom of Mount Everest.
          <br/><br/>In a swimsuit.
          <br/>
          <br/>
          - <strong><italic>Nina Stossinger</italic></strong>
        </div>
      </div>
    )
  }
})
