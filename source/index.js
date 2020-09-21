import React    from 'react'
import ReactDOM from 'react-dom'
import Sidebar  from './sidebar.js'
import Main     from './main.js'
import Page1    from './page1.js'
import Page2    from './page2.js'
import Page3    from './page3.js'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'


class Navbar extends React.Component
{
    render()
    {
        return (
            <div className='navBar'>
                <Link to='/game'>    <div>game</div>    </Link>
                <Link to='/user'>    <div>user</div>    </Link>
                <Link to='/gallery'> <div>gallery</div> </Link>
            </div>
        );
    }
}
class Container extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state =
        {
            activeSidebar: true, 
            Dimention: 3,
            CountPlay: 0,
            FormType: 'signup', 
            isLogged: false, 
            User: {},               // User отличается от Users наличием своего index'а в массиве Users
            Users: [],
            countIMG: 5,
            widthIMG: 400,
        }
        this.updateState = this.updateState.bind(this);
    }
    updateState(newState)
    {
        this.setState(newState)
    }
    render()
    {
        const N = this.state.Dimention;
        return (
            <div id='container'>
                <Sidebar options={this.state} updateParentState={this.updateState}/>
                <Main    options={this.state} updateParentState={this.updateState} >
                    <Switch>
                    <Route exact path='/'>         <Page1 key={N} options={this.state} updateParentState={this.updateState}/></Route>
                    <Route exact path='/game'>     <Page1 key={N} options={this.state} updateParentState={this.updateState}/></Route>
                    <Route exact path='/user'>     <Page2         options={this.state} updateParentState={this.updateState}/></Route>
                    <Route exact path='/gallery'>  <Page3         options={this.state} updateParentState={this.updateState}/></Route>
                    <Route render={() => <h1 align='center'>Not found ...</h1>}/>
                    </Switch>
                </Main>
            </div>
        );
    }
}
class Footer extends React.Component
{
    render()
    {
        return (
            <footer>
            </footer>
        );
    }
}
class App extends React.Component
{
    render()
    {
        return (
            <Router>
                <Navbar />
                <Container />
                <Footer />
            </Router>
        );
    }
}
ReactDOM.render(<App />,  document.getElementById('app'));
