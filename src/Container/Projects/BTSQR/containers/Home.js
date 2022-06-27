import Header from '../components/Header';
import pngRabbit from '../images/Rabbit.png';
import "../css/Home.css";
const Home = () => {
    return (
        <div className="container-fluid">
            <Header />
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