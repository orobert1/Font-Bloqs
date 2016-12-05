const React = require('react');
const ReactDOM = require('react-dom');
const Grid = require('../util/grid.js');
const Shutter = require('./shutter');


module.exports = React.createClass({
  componentDidMount(){
    let cover = document.getElementById("cover");
    cover.style.height = window.innerHeight + "px";
    cover.style.width = window.innerWidth + "px";
    cover.style.overflow = "hidden";
  },

  createShutters(){
    let shutters = new Array(30);
    for (var i = 0; i < shutters.length; i++) {
      shutters[i] = this.props.grid;
    }
    return shutters.map(
      function( el, index ){
        let text = false;
        let cloud = false;
        switch(index){
          case 0:
            cloud = { top: 3, seed: 4, index: index, height: 8};
            break;
          case 9:
            cloud = { top: 0, seed: 1, index: index, height: 10};
            break;
          case 10:
            text = { top: 6, text: "Font", index: index, size: 120, direction: "left"}
            break;
          case 16:
            cloud = { top: 13, seed: 2, index: index, height: 10};
            break;
          case 15:
            text = { top: 11, text: "Bloqs", index: index, size: 120, direction: "right"}
            break;
        }
        return <Shutter cloud = { cloud }
          text = { text }
           grid = {el}
           num = {index}
           key = {index}
           id = {"shutter" + index} ></Shutter>
      }
    )
  },

  render(){
    return(
      <div id = "cover">
        {
          this.createShutters()
        }
      </div>
    )
  }
})
