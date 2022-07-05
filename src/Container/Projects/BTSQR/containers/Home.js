// import Header from '../components/Header';
import pngRabbit from '../images/Rabbit.png';
import "../css/Home.css";
import { useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../../../../Firebase Config/firebase';

const Home = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const authentication = onAuthStateChanged(auth,(user) => {
            if (!user) {
                navigate('/')
            }
        }) 
        
        return authentication
    },[])

    return (
        <div className="content-wrapper">
            {/* <Header /> */}
            <div className="carousel-inner monitor-home">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <span className="welcomeText">Welcome To Rabbit</span>
                        <div className="box-img"><img src={pngRabbit} style={{maxHeight:'100%', maxWidth:'100%', display:'block'}} alt="Rabbit"/></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home