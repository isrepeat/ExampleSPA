import React from 'react'

class Page3 extends React.Component
{
    render()
    {
        const countIMG = this.props.options.countIMG;
        const widthIMG = this.props.options.widthIMG+'px';
        return (
            <div className={'Gallery '}>
            <br/>
            { countIMG >= 2 &&
                <>
                <img src='/resources/images/1.jpg' width={widthIMG}/>
                <img src='/resources/images/2.jpg' width={widthIMG}/>
                </>
            }
            { countIMG >= 5 &&
                <>
                <img src='/resources/images/3.jpg' width={widthIMG}/>
                <img src='/resources/images/4.jpg' width={widthIMG}/>
                <img src='/resources/images/5.jpg' width={widthIMG}/>
                </>
            }
            { countIMG == 10 &&
                <>
                <img src='/resources/images/6.jpg' width={widthIMG}/>
                <img src='/resources/images/7.jpg' width={widthIMG}/>
                <img src='/resources/images/8.jpg' width={widthIMG}/>
                <img src='/resources/images/9.jpg' width={widthIMG}/>
                <img src='/resources/images/10.jpg' width={widthIMG}/>
                </>
            }
            <br/>
            <br/>
            </div>
        );
    }
}
export default Page3;
