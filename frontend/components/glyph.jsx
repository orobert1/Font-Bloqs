const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const Actions = require( '../actions/glyphActions' );

module.exports = React.createClass( {
 componentDidMount( ){
  let options={};
  this.props.glyph.render( this.props.glyphId,50,options );
 },
 click( ){
  Actions.changeCurrentGlyph( this.props.glyphId,50 );
 },
 render( ){

  return( 
   <div>
    <canvas onClick = {this.click} className={"inner-center-text"} className="glyphIcon" id={this.props.glyphId}></canvas>
   </div>
   )
 }
} )
