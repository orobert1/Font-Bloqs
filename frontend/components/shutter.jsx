const React = require('react');
const ReactDOM = require('react-dom');
const Cloud = require('./cloud');
const Text = require('./text');
const Glyph = require( '../util/glyph' );
const ReactGlyph = require( './glyph' );
const LinkToChoose = require('./linktochoose');




module.exports = React.createClass({
  componentDidMount(){
    let div = document.getElementById( this.props.id );
    if( this.props.noShadow ){
      div.boxShadow = "0px";
    }
    div.className = "shutter";
    div.style.height = window.innerHeight + "px";
    div.style.width = "200px";
    div.style.marginLeft = 0 - this.props.gutterX + "px";
    div.style.zIndex = 1000 - this.props.num;
  },





  cloud(){
    if( this.props.text ){
      return ( <Text text = { this.props.text }/>)
    }
  },

  text(){
    if( this.props.cloud ){
      return ( <Cloud cloud = { this.props.cloud } />)
    }
  },

  font(){

    let result = [];
    if( this.props.font ){
      if( this.props.font.xMin ){
        let total = this.props.font.totalGlyphs
        let scale = .02;
        for (var i = 0; i < total; i++) {
          let glyph = new Glyph( i, this.props.font, scale, total );
          result.push( <ReactGlyph key={i} ind = {i} glyph={glyph} glyphId={"Glyph"+i} ></ReactGlyph> )
      }
      }else{
        return(
          <LinkToChoose></LinkToChoose>
        )
      }
    }
    return result;
  },

  render(){
    return(
      <div className = "shutter" id = { this.props.id }>
        {

          this.cloud()

        }

        {

          this.text()

        }
        <div className = "scrollable">
          {
            this.font()
          }
        </div>
      </div>
    )
  }
})
