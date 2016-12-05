const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const Actions = require( '../actions/glyphActions' );

module.exports = React.createClass( {
 componentDidMount( ){
  let options={};
  this.props.glyph.render( this.props.glyphId,50,options );
 },
 componentWillReceiveProps(newProps){
   let options={};

   this.props.glyph.render( this.props.glyphId,50,options );
 },

 click( ){
  $('html, body').animate({scrollTop: $("#glyphCanvas").offset().top}, 400);
  Actions.changeCurrentGlyph( this.props.ind, 50 );
 },

 render( ){
  return(
   <div className = "glyphIcon">
    <canvas onClick = {this.click} className={"inner-center-text"} className="glyphIcon" id={this.props.glyphId}></canvas>
   </div>
   )
 }
} )
