import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
const React = require( "react" );
const ReactDOM = require( "react-dom" );
const newFont = require( './components/newFont' );
const Index = require( './components/index' );
const App = React.createClass( {
 render( ){
  return( 
   <div>
    {this.props.children}
   </div>
   );
 }
} );

const routes = ( 
 <Route path='/' component={App}>
  <IndexRoute component={Index}/>
  <Route path='/new_font' component={newFont}/>
  <Route path='/index' component={Index}/>
 </Route>
 );

document.addEventListener( 'DOMContentLoaded', function( ){
 ReactDOM.render( <Router routes={routes} history={hashHistory}>

 </Router>, document.getElementById( "content" )
 );
} );
