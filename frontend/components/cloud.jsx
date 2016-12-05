const React = require('react');
const ReactDOM = require('react-dom');
const Grid = require('../util/grid');

module.exports = React.createClass({
  componentDidMount(){
    let cloud = document.getElementById("cloud" + this.props.cloud.index);
    cloud.style.top = this.props.cloud.top;
    if( this.props.cloud.seed === 3 ){
      cloud.className = "cloud cloud1";
    }
    if( this.props.cloud.seed ===2 ){
      cloud.className = "cloud cloud2";
    }
    if( this.props.cloud.seed ===1 ){
      cloud.className = "cloud cloud1";
    }
    if( this.props.cloud.seed ===4 ){
      cloud.className = "cloud cloud4";
    }
    let grid = new Grid();
    grid.alignTop( cloud, this.props.cloud.top );
    window.setTimeout(function(){
      let grid = new Grid();
      cloud.style.marginLeft = 0 - grid.gutterX + "px";
    }, 1000+ (Math.random() * 1000));
    if( this.props.cloud.height ){
      grid.picHeight( cloud, this.props.cloud.height );
    }
  },

  render(){
    return(
      <div className = "cloud" id = { "cloud" + this.props.cloud.index}>

      </div>
    )
  }
})
