import '../css/main.css'

import background from '../img/main/background.png';

function Main(){
    return(
        <div className='main'>
            <div className='main-container'>
                
                <img src={background} alt="background" className='background-container'>
                    <div className='main-banner'>
                        <h1>머니웨이에서 떠나는 갓성비 제주도 여행</h1>
                    </div>
                </img>        


                <div className='second-banner'>
                    
                </div>
            </div>
        </div>
    )

}
export default Main;