const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const Actions = require( '../actions/glyphActions' );

module.exports = React.createClass( {
 componentDidMount( ){
  let options={};
  this.props.glyph.render( this.props.glyphId,50,options );
  let icon = document.getElementById( this.props.glyphId );
  if( this.props.ind < 40 ){
    icon.style.opacity = 0;
    window.setTimeout( function(){
      icon.style.transition = ".4s";
      icon.style.opacity = 1;
    }, this.props.ind * 100 );
  }
 },
 componentWillReceiveProps(newProps){
   let options={};
   this.props.glyph.render( this.props.glyphId,50,options );
   let icon = document.getElementById( this.props.glyphId );
   icon.style.opacity = 0;
   window.setTimeout( function(){
     icon.style.transition = ".4s";
     icon.style.opacity = 1;
   }, this.props.ind * 100 );
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
