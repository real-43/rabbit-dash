import { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import rabbit from '../images/Rabbitcard.png'
import "../css/Login_Rabbit.css";
import { base_api } from '../config';

const Login_Rabbit = () => {
    let history = useHistory();
    const ClientId = '239632812014-hkdqhseqll1uc2grtgkf22m5n7jf3438.apps.googleusercontent.com';
    const [loginfail, setLoginfail] = useState('')

    const responseGoogle = async (response) => {
        if (!response.error) {
            console.log(response)
            const res = await checkUser(response.profileObj.email);
            if (res['status'] === true) {
                localStorage.setItem('Token', response.accessToken)
                localStorage.setItem('Email', response.profileObj.email)
                localStorage.setItem('Name', response.profileObj.name)
                localStorage.setItem('Role', res['data']['role'])
                localStorage.setItem('Status', res['data']['status'])
                history.push('/smartwatch_search')
            } else {
                setLoginfail(response.profileObj.email)
            }
        }
    }

    const checkUser = (email) => {
        return new Promise(async (resolve, reject) => {
            let response = await axios({
                method: "get",
                url: `${base_api}/login/${email}`,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'rabbit2020ok'
                }
            });
            resolve(response.data)
        })
    }

    return (
        <div className="bg-login">
            <div className="bg-login-left">
                <div className="box-bg-login center">
                    <img src={rabbit} style={{ width: '100%'}} />
                </div>
            </div>
            <div className="bg-login-right">
                <div className="Login-Group">
                    <div className="text-center">
                        <label style={{ fontSize: '50px', fontWeight: '700', marginBottom: '150px', color: '#58595B' }}>Sign In</label>
                        {
                            loginfail ?
                                <div className="alert text-white mt-3 text-center font-weight-bold" role="alert" style={{ background: '#FF3200' }}>
                                    This email cannot login !!!
                            </div>
                                : ''
                        }
                        <div style={{ paddingTop: '10px' }}>
                            <GoogleLogin
                                clientId={ClientId}
                                render={renderProps => (
                                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} style={{ backgroundColor: '#58595B', fontSize: '22px', padding: '10px 40px 10px 40px', color: '#FFFFFF', border: 'none', borderRadius: '1.5rem' }}>
                                        Sign In with Google
                                    </button>
                                )}
                                // buttonText="Login with Google"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                scope={'email'}
                                hostedDomain="rabbit.co.th"
                                isSignedIn={true}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login_Rabbit;