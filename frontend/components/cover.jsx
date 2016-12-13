const React = require('react');
const ReactDOM = require('react-dom');
const Grid = require('../util/grid.js');
const Shutter = require('./shutter');
const Vimeo = require('react-vimeo');

module.exports = React.createClass({
  componentDidMount(){
    let cover = document.getElementById("cover");
    let title = document.getElementById("title");

    cover.style.height = window.innerHeight + "px";
    cover.style.width = window.innerWidth + "px";
    cover.style.overflow = "hidden";

    let grid = new Grid();
    window.setTimeout( function(){
      document.getElementById("title").style.transition = "2s";
      document.getElementById("title").style.opacity = 1;
    }, 1000);
    grid.alignLeft( title, 15 );
    grid.alignTop( title, 10 );
    this.setTime(10);
    window.setInterval(function(){
      let cover = document.getElementById("cover");
        if( window.scrollY < window.innerHeight ){
          cover.style.height = window.innerHeight - window.scrollY + "px";
          this.setTime(10);
        }else{
          cover.style.height = "0px";
          this.setTime(1000);
        }
    }.bind(this), this.getTime);

  },

  setTime( time ){
    this.time = time;
  },

  getTime(){
    return this.time;
  },



  render(){
    return(
      <div id = "cover">
        <div className = "inside">
          <div id = "title"> Font <br></br> Bloqs</div>
          <iframe src="http://oscarrobert.com/background/"></iframe>
        </div>
      </div>
    )
  }
})
