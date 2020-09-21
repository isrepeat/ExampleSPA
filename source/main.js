import React from 'react'

class Main extends React.Component
{
    constructor(props)
    {
        super(props)
        this.handlerClick = this.handlerClick.bind(this);
    }
    handlerClick(event)
    {
         const newState = {activeSidebar: !this.props.options.activeSidebar};
         this.props.updateParentState(newState);
    }
    render()
    {
        return (
            <main>
                <div className='toogle' onClick={this.handlerClick}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className='content'>
                    <section>
                        {this.props.children}
                    </section>
                </div>
            </main>
        );
    }
}

export default Main;