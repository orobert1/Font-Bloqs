const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const Link = require( 'react-router' ).Link;
const NewFont = require( './newFont' );

module.exports = React.createClass( {
 contextTypes: {
   router: React.PropTypes.object.isRequired
  },
 render( ){
  return( 
   <Link to={'/new_font'} >Create A New Font</Link>
   )
 }
} )
