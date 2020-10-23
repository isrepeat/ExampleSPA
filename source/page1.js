import React from 'react'

class Page1 extends React.Component
{
    constructor(props)
    {
        super(props)
        this._isMounted = false;                            // для "прерывания" цепочки промисов
        
        const N    = this.props.options.Dimention;
        this.state = 
        {
            Dim: N,
            steps: 0,
            currentX: true,
            winner: 'Play ...',
            freeze: false
        }
        this.field = Array(N).fill().map(() => Array(N).fill('?'))

        this.handlerClick = this.handlerClick.bind(this);
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                   Restart                                                    */
    /*--------------------------------------------------------------------------------------------------------------*/
    restart(children)
    {
        const N = this.state.Dim;    
        this.field = Array(N).fill().map(() => Array(N).fill('?'))
        
        children.forEach(child => child.classList.remove('writeX','writeO','winner'));
        this.setState({steps: 0, currentX: true, winner: 'Play ...', freeze: false})
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                    Check                                                     */
    /*--------------------------------------------------------------------------------------------------------------*/
    check(children, currStep)
    {
        const Dim = this.state.Dim;
        function winner(field)
        {
            let N = Dim-1;              // для удобства сравнения i==N-j (вместо i==N-1-j)
            let combo = [];             // выиграшные комбинации индексов
            
            //поскольку flat() не поддерживается в Edge, то для линеаризации двумерного массива используем свой метод.

            // k - номер строки; 
            // N - количество возможных кобминаций в строках
            for(let k=0; k<=N; k++)
            {
                // проходимся по строкам, а в каждой строке по столбцам => ставим true в ячейку, если текущая строка матрицы == k
                // затем линеаризуем матрицу, вместо true ставим индекс в линеаризованном массиве и фильтруем =>
                // вернется массив длинной Dim типа [0,1,2] (строка)
                let temp = field.map((row,i) => row.map((col,j) => i==k   ?true:null));
                    temp = [].concat(...temp);
                combo.push( temp.map((el, i) => el ?i:null).filter(el => el!==null) );
            }

            // k - номер столбца; 
            // N - количество возможных кобминаций в столбцах
            for(let k=0; k<=N; k++)
            {
                // проходимся по строкам, а в каждой строке по столбцам => ставим true в ячейку, если текущий столбец матрицы == k
                // затем линеаризуем матрицу, вместо true ставим индекс в линеаризованном массиве и фильтруем =>
                // вернется массив длинной Dim типа [0,3,6] (столбец)
                let temp = field.map((row,i) => row.map((col,j) => j==k   ?true:null));
                    temp = [].concat(...temp);
                combo.push( temp.map((el, i) => el ?i:null).filter(el => el!==null) );
            }

            // в матрицу поля заносим true если ячейка находится на главной/побочной диагонали, затем линеаризуем матрицу,
            // вместо true ставим индекс в линеаризованном массиве и фильтруем => вернется массив длинной Dim типа [0,4,8] (диагональ)
            {
                let temp = field.map((row,i) => row.map((col,j) => i==j   ?true:null));
                    temp = [].concat(...temp);
                combo.push( temp.map((el, i) => el ?i:null).filter(el => el!==null) );
            }
            {
                let temp = field.map((row,i) => row.map((col,j) => i==N-j ?true:null));
                    temp = [].concat(...temp);
                combo.push( temp.map((el, i) => el ?i:null).filter(el => el!==null) );
            }

            //field = field.flat();       
            field = [].concat(...field);    // линеаризуем field чтобы обращаятся к нему так: field[combo[x][y]]...

            for(let win, k=0; k<combo.length; k++) 
            {
                win=true;   for(let j=0; j<=N; j++) if(field[combo[k][j]]!=='x') {win=false; break;}    if(win) return ['X', combo[k]];
                win=true;   for(let j=0; j<=N; j++) if(field[combo[k][j]]!=='o') {win=false; break;}    if(win) return ['O', combo[k]];   
            }
            return [null, null]
        }
        let [name, indices] = winner(this.field);


        if(name == null)  // если пока нет победителя выходим из функции check(), но ...
        {   
            if(currStep == Dim*Dim)   // если это последний ход, делаем рестарт
            {
                this.setState({winner: 'No winner', freeze: true});    
                new Promise(r => setTimeout(r, 2000)).then( () => {this._isMounted && this.restart(children)} );
            }
            return;
        }

        // Победа:
        const winners = indices.map(i => children[i]);  // получаем реальные ячейки DOM по индексам выиграшной комбинации
        this.setState({winner: `winner ${name}`, freeze: true});

        let  CountPlay  = this.props.options.CountPlay;
        let  USER       = this.props.options.User;        
             USER.count = ++CountPlay;
        this.props.updateParentState({CountPlay:CountPlay, User:USER});
        
        new Promise(r => setTimeout(r, 250))
        .then( () => {this._isMounted && winners.forEach(cell => cell.classList.add('winner')); return new Promise(r => setTimeout(r, 2500))} )
        .then( () => {this._isMounted && this.restart(children)} )
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                   onClick                                                    */
    /*--------------------------------------------------------------------------------------------------------------*/
    handlerClick(event)
    {
        if(this.state.freeze) return;
        if(event.target == event.currentTarget) return;
        if(event.target.classList.contains('writeX')) return;
        if(event.target.classList.contains('writeO')) return;
        
        const children = [...event.target.parentElement.children];
        const index = children.indexOf(event.target);
        
        const N = this.state.Dim; 
        
        if(this.state.currentX)
        event.target.classList.add('writeX'), this.field[index/N|0][index%N] = 'x'; // index/N|0 для деления нацело
        else
        event.target.classList.add('writeO'), this.field[index/N|0][index%N] = 'o';
        
        const State = this.state;   
        State.steps++; State.currentX = !State.currentX;  
        this.setState(State); 

        // т.к. state не обновляется мгновенно, передаем State.steps
        if(State.steps >= N) this.check(children, State.steps); 
    }
    componentDidMount()
    {
        this._isMounted = true;
    }
    componentWillUnmount()
    {
        this._isMounted = false;
    }
    /*--------------------------------------------------------------------------------------------------------------*/
    /*                                                    Render                                                    */
    /*--------------------------------------------------------------------------------------------------------------*/
    render()
    {
        const N = this.state.Dim;
        return (
            <>
            <br/>
            <h1 align='center'>{this.state.winner}</h1>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className='Field' onClick={this.handlerClick} style={{width: 150*N, height: 150*N}}>
                {Array(N*N).fill().map((item,index) => <div key={index}></div>)}
            </div>
            <br/>
            <br/>
            </>
        );
    }
}

export default Page1;
