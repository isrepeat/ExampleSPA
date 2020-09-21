import React from 'react'

class Page2 extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            Form : {player:'', password:'', description:'...'},
            Valid: {ok:true, message:''},
        }

        this.handlerChange = this.handlerChange.bind(this);
        this.handlerSignUP = this.handlerSignUP.bind(this);
        this.handlerLogIN  = this.handlerLogIN.bind(this);
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                 Change input                                                 */
    /*--------------------------------------------------------------------------------------------------------------*/
    handlerChange(event)                // срабатывает при вводе каждой буквы
    {
        let value = event.target.value;
        let name  = event.target.name;
        
        let Form  = this.state.Form;    Object.assign(Form, {[name]:value}) // для сливания частей под-объектов state 
        this.setState({Form:Form})
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                  Validation                                                  */
    /*--------------------------------------------------------------------------------------------------------------*/
    validation(name, value)
    {
        let ok = true;
        let message = '';
        if(name === 'player')
        {
            if(!value)
                ok = false, 
                message = 'Name must not be empty';
            else
            if(/^[\w\d]+$/i.test(value) == false) 
                ok = false, 
                message = 'Name must consist only symbols "a-z" or "_" or digits';
            else
            if(/^[\w\d]{3,}$/i.test(value) == false) 
                ok = false, 
                message = 'Name length must be greater 3 symbols';
            else
            if(/^[\w\d]{3,10}$/i.test(value) == false) 
                ok = false, 
                message = 'Name length must be less 10 symbols';
        }
        if(name === 'password')
        {
            if(!value)
                ok = false, 
                message = 'Password must not be empty';
            else
            if(/^[\w\d]+$/i.test(value) == false) 
                ok = false, 
                message = 'Password must consist only symbols "a-z" or "_" or digits';
            else
            if(/^[\w\d]{3,}$/i.test(value) == false) 
                ok = false, 
                message = 'Password length must be greater 3 symbols';
            else
            if(/^[\w\d]{3,10}$/i.test(value) == false) 
                ok = false, 
                message = 'Password length must be less 10 symbols';
        }
        if(name === 'description')
        {
            if(/^[\w\d.,!@#$%^*;<>]+$/i.test(value) == false) 
                ok = false, 
                message = 'Description consist wrong symbols';
            else
            if(/^[\w\d.,!@#$%^*;<>]{0,10}$/i.test(value) == false) 
                ok = false, 
                message = 'Description length must be less 10 symbols';
        }

        return [ok, message]
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                    SignUP                                                    */
    /*--------------------------------------------------------------------------------------------------------------*/
    handlerSignUP(event)
    {
        event.preventDefault();
        const inputs = [...event.target.querySelectorAll('input')]  // преобразуем коллекцию объектов в массив объектов
        const inputsData = []
        let   VALID = {ok:true, message:''};
        /*----------------------------------------------------------------------------------*/
        /*                                     Validate                                     */
        /*----------------------------------------------------------------------------------*/
        for(let [i,{name,value}] of inputs.entries())               // в цикл передается obj:{..., name:***, value:***,...}
        {
               [VALID.ok, VALID.message] = this.validation(name, value);    
            if(!VALID.ok)
            {
                inputs[i].classList.add('WrongInput');
                this.setState({Valid:VALID});
                return;
            }
            inputs[i].classList.remove('WrongInput');
            inputsData[name] = value;
        }
        this.setState({Valid:VALID});
        /*----------------------------------------------------------------------------------*/
        /*                                     POST Signup                                  */
        /*----------------------------------------------------------------------------------*/
        let userData  = {...inputsData, count:this.props.options.CountPlay};
        
        fetch('/signup',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
        })
        .then(res  => res.json())
        .then(data => 
        {
            console.log(data);
            const [writed, USER, USERS] = data;     
            if   (!writed) 
            {
                this.setState({Valid:{ok:false, message:'This player already exists'}}); 
                return;
            }
            this.props.updateParentState(           // благодаря '() =>' this не undefined
            {
                isLogged:true,
                CountPlay:USER.count, 
                User:USER,                          // USER отличается от USERS наличием своего index'а в массиве USERS
                Users:USERS
            })
        })       
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                    LogIN                                                     */
    /*--------------------------------------------------------------------------------------------------------------*/
    handlerLogIN(event)
    {
        event.preventDefault();
        let   VALID  = {ok:true, message:''};
        const inputs = [...event.target.querySelectorAll('input')] // преобразуем коллекцию объектов в массив объектов
        const inputsData = []
        /*----------------------------------------------------------------------------------*/
        /*                                     Validate                                     */
        /*----------------------------------------------------------------------------------*/
        for(let [i,{name,value}] of inputs.entries())              // в цикл передается obj:{..., name:***, value:***,...}
        {
               [VALID.ok, VALID.message] = this.validation(name, value);    
            if(!VALID.ok)
            {
                inputs[i].classList.add('WrongInput');
                this.setState({Valid:VALID});
                return;
            }
            inputs[i].classList.remove('WrongInput');
            inputsData[name] = value;
        }
        this.setState({Valid:VALID});
        /*----------------------------------------------------------------------------------*/
        /*                                     POST Login                                   */
        /*----------------------------------------------------------------------------------*/
        let userData = {...inputsData}
        
        fetch('/login',
        {
            method:  'POST',
            headers: {'Content-Type': 'application/json'},
            body:    JSON.stringify(userData),
        })
        .then(res  => res.json())
        .then(data => 
        {
            console.log(data);
            const [Logged, USER, USERS] = data;
            if   (!Logged) 
            {
                this.setState({Valid:{ok:false, message:'Incorrect name or password'}}); 
                return;
            }
            this.props.updateParentState(           // благодаря '() =>' this не undefined
            {
                isLogged:true,
                CountPlay:USER.count, 
                User:USER,                          // USER отличается от USERS наличием своего index'а в массиве USERS
                Users:USERS
            })
        })
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                    Render                                                    */
    /*--------------------------------------------------------------------------------------------------------------*/
    render()
    {
        let FormType = this.props.options.FormType;
        let Logged   = this.props.options.isLogged;
        let id       = this.props.options.User.index;
        let Users    = this.props.options.Users;
        let VALID    = this.state.Valid;
        return (
            <>
            <br/>
            {   Logged == false &&
                <h1 align='center'>Registration</h1>
            }
            {   Logged == true  &&
                <h1 align='center'>Players records</h1>
            }
            <br/>
            <br/>
            {/* --------------------------------------------------------------------------------------------------- */}
            {   FormType === 'signup'  &&  Logged == false &&
            <form className='Form SignUP'  onSubmit={this.handlerSignUP}>
                                                <div>Sign up</div>
                <label>      Player: <input type='text'     name='player'      placeholder='enter name'     value={this.state.Form.player}       onChange={this.handlerChange}/></label>
                <label>    Password: <input type='password' name='password'    placeholder='enter password' value={this.state.Form.password}     onChange={this.handlerChange}/></label>
                <label> Description: <input type='text'     name='description'                              value={this.state.Form.description}  onChange={this.handlerChange}/></label>
                <button type='submit'>Sign up</button>
                { VALID.ok == false && <div className='ErrorMessage'>{VALID.message}</div> }
            </form> 
            }
            {/* --------------------------------------------------------------------------------------------------- */}
            {   FormType === 'login'  &&  Logged == false &&
            <form className='Form LogIN'  onSubmit={this.handlerLogIN}>
                                                <div>Log in</div>
                <label>      Player: <input type='text'     name='player'      placeholder='your name'     value={this.state.Form.player}       onChange={this.handlerChange}/></label>
                <label>    Password: <input type='password' name='password'    placeholder='your password' value={this.state.Form.password}     onChange={this.handlerChange}/></label>
                <button type='submit'>Log in</button>
                { VALID.ok == false && <div className='ErrorMessage'>{VALID.message}</div> }
            </form>
            }
            {/* --------------------------------------------------------------------------------------------------- */}
            {   Logged == true &&
                <table className='Table'>
                <thead>
                    <tr><th>Name</th><th>Description</th><th>Counts</th></tr>
                </thead>
                <tbody>
                    {Users.map( (user,i) =>
                        <tr key={i} className={i==id?'Player':''}>
                            <td>{user.player}</td><td>{user.description}</td><td>{user.count}</td>
                        </tr> 
                    )}
                </tbody>
                </table>
            }
            {/* --------------------------------------------------------------------------------------------------- */}
            </>
        );
    }
}

export default Page2;