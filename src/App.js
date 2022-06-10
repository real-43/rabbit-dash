import './App.css';
import Header from './components/Header';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import LoginPage from './components/page/LoginPage';

function App() {
  return (
    <div class="wrapper">
      {/*<LoginPage/>*/}
      <Header/>
      <Menu/>
      <Dashboard/>
      <Footer/> 
    </div>
  );
}

export default App;
