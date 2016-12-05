const React = require('react');
const ReactDOM = require('react-dom');
const Grid = require('../util/grid');
const Shutter = require('./shutter');


module.exports = React.createClass({
  componentDidMount(){
    let head = document.getElementById("head");
    head.style.width = window.innerWidth;
    head.style.height = window.innerHeight;
    console.log("font  " + this.props.font)
  },


  render(){
    return(
      <div className = "head" id = "head">
        <Shutter
          cloud = { false }
          text = { false }
           grid = { new Grid() }
           num = {31}
           key = {31}
           font = { this.props.font }
           noShadow = {true}
           id = {"shutter31"} ></Shutter>
      </div>
    )
  }
});
