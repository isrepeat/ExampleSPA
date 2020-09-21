import React from 'react'
import {Route, Switch, Link} from 'react-router-dom'

/*--------------------------------------------------------------------------------------------------------------*/
/*                                         Option for Page 1                                                    */
/*--------------------------------------------------------------------------------------------------------------*/
class Option_1 extends React.Component
{
    constructor(props)
    {
        super(props)
        this.handlerClick = this.handlerClick.bind(this);
    }
    handlerClick(event)
    {
        if(event.target == event.currentTarget) return;

        const dim = +event.target.getAttribute('data-dim'); // преобразуем строку в число явно!
        const newState = {Dimention: dim};
        this.props.updateParentState(newState);
    }
    render()
    {
        const CountPlay = this.props.options.CountPlay;
        return (
            <div className='Option_1'>
                <p>Size:</p>
                <ul onClick={this.handlerClick}>
                    <li data-dim='2'>2x2</li>
                    <li data-dim='3'>3x3</li>
                    <li data-dim='4'>4x4</li>
                </ul>
                <br/>
                <br/>
                <div style={{fontSize:'20px'}}>Counts: {CountPlay}</div>
            </div>
        );
    }
}
/*--------------------------------------------------------------------------------------------------------------*/
/*                                         Option for Page 2                                                    */
/*--------------------------------------------------------------------------------------------------------------*/
class Option_2 extends React.Component
{
    constructor(props)
    {
        super(props)
        this.handlerForm    = this.handlerForm.bind(this);
        this.handlerPlayer  = this.handlerPlayer.bind(this);
    }
    handlerForm(event)      // Выбор типа формы: LogIN, SignUP
    {
        if(event.target == event.currentTarget) return;

        const type = event.target.getAttribute('data-type');
        const newState = {FormType: type};
        this.props.updateParentState(newState);
    }
    handlerPlayer(event)    // Опции игрока: сохранить, выйти
    {
        if(event.target == event.currentTarget) return;

        const type = event.target.getAttribute('data-type');

        if(type === 'save')
        {
            const USER = this.props.options.User;

            fetch('/save',
            {
                method:  'POST',
                headers: {'Content-Type': 'application/json'},
                body:    JSON.stringify(USER),
            })
            .then(res  => res.json())
            .then(data => 
            {
                console.log(data);
                const [Saved, USERS] = data;    if(!Saved) return;
    
                this.props.updateParentState({Users: USERS})    // User и его index мы уже получили когда залогинились ...
            })
        }
        if(type === 'exit')
        {
            this.props.updateParentState({isLogged:false, CountPlay:0})
        }
    }
    render()
    {
        let Logged = this.props.options.isLogged;
        let Player = this.props.options.User.player;
        return (
            <div className='Option_2'>
            {   Logged == false &&
                <>
                <p>Form:</p>
                <ul onClick={this.handlerForm}>
                    <li data-type='signup'>SignUP</li>
                    <li data-type='login' >LogIN</li>
                </ul>
                </>
            }
            {   Logged == true &&
                <>
                <p style={{fontSize:'20px'}}> Player: {Player}</p>
                <ul onClick={this.handlerPlayer}>
                    <li data-type='save'>Save</li>
                    <li data-type='exit'>Exit</li>
                </ul>
                </>
            }
            </div>
        );
    }
}
/*--------------------------------------------------------------------------------------------------------------*/
/*                                         Option for Page 3                                                    */
/*--------------------------------------------------------------------------------------------------------------*/
class Option_3 extends React.Component
{
    constructor(props)
    {
        super(props)
        this.handlerClick = this.handlerClick.bind(this);
    }
    handlerClick(event)
    {
        if(event.target == event.currentTarget) return;

        // console.log(event.target.parentElement);

        if(event.target.parentElement.getAttribute('data-name') == 'count')
        {
            const count    = +event.target.getAttribute('data-count');            // преобразуем строку в число явно!
            const newState = {countIMG: count};
            this.props.updateParentState(newState);
        }
        if(event.target.parentElement.getAttribute('data-name') == 'width')
        {
            const width    = +event.target.getAttribute('data-width');            // преобразуем строку в число явно!
            const newState = {widthIMG: width};
            this.props.updateParentState(newState);
        }
    }
    render()
    {
        return (
            <div className='Option_3'>
                <p>Count img:</p>
                <ul onClick={this.handlerClick} data-name='count'>
                    <li data-count='2' >2 </li>
                    <li data-count='5' >5 </li>
                    <li data-count='10'>10</li>
                </ul>
                <br/>
                <br/>
                <p>Width img:</p>
                <ul onClick={this.handlerClick} data-name='width'>
                    <li data-width='200'>200 px</li>
                    <li data-width='400'>400 px</li>
                    <li data-width='600'>600 px</li>
                </ul>
            </div>
        );
    }
}
/*--------------------------------------------------------------------------------------------------------------*/
/*                                                   Sidebar                                                    */
/*--------------------------------------------------------------------------------------------------------------*/
class Sidebar extends React.Component
{
    render()
    {
        const classSidebar = this.props.options.activeSidebar ? 'Sidebar_vissible' : 'Sidebar_hidden'
        return (
            <aside className={'Sidebar '+classSidebar}>
            <Switch>
                <Route exact path='/'>          <Option_1 options={this.props.options} updateParentState={this.props.updateParentState}/></Route>
                <Route exact path='/game'>      <Option_1 options={this.props.options} updateParentState={this.props.updateParentState}/></Route>
                <Route exact path='/user'>      <Option_2 options={this.props.options} updateParentState={this.props.updateParentState}/></Route>
                <Route exact path='/gallery'>   <Option_3 options={this.props.options} updateParentState={this.props.updateParentState}/></Route>
                <Route render={() => <div></div>}/>
            </Switch>
            </aside>
        );
    }
}

export default Sidebar;