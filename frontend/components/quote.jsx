const React = require('react');
const ReactDOM = require('react-dom');
const Grid = require('../util/grid.js');
const checkWindow = require('../util/checkWindow');
const Cloud = require('./cloud');


module.exports = React.createClass({
  componentDidMount(){
    let g = document.getElementById("g");
    let quote =  document.getElementById("quote");
    quote.style.width = window.innerWidth + "px";
    quote.style.height = window.innerHeight + "px";
    let poem = document.getElementById("typePoem");
    this.props.win.registerElement( poem, function( el ){
      el.style.transition = "2s";
      el.style.opacity = 1;
    } );

    this.props.win.registerElement( g, function( el ){
      el.style.transition = "2s";
      el.style.opacity = 1;
    } );
    let grid = new Grid();
    grid.alignLeft( poem, 10 );
    grid.alignTop( poem, 8 );
    grid.picWidth( poem, 5 );
    grid.alignLeft( g, 16  );
    grid.alignTop( g, 8 );
    grid.picHeight( g, 10 );

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
        <Cloud cloud = { {top: 4, seed: 4, index: 12, height: 14}} />
        <div className = "g" id = "g"/>
      </div>
    )
  }
})
