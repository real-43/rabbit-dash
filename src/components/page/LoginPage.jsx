import React from 'react';
import "./LoginPage.css"

const LoginPage = () => {
    return (
        <div>
            <div class="container">
                <div class="row">
                <div class="col-md-6 offset-md-3">
                    <h2 class="text-center text-dark mt-5">Login Form</h2>
                    {/* <div class="text-center mb-5 text-dark">Made with bootstrap</div> */}
                    <div class="card my-5">

                    <form class="card-body cardbody-color p-lg-5">

                        <div class="text-center">
                        <img src="./rabbitcard-logo.jpg" class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                            width="100px" alt="rabbit card logo" />
                        </div>

                        <div class="mb-3">
                        <input type="text" class="form-control" id="Username" aria-describedby="emailHelp"
                            placeholder="User Name"/>
                        </div>
                        <div class="mb-3">
                        <input type="password" class="form-control" id="password" placeholder="password" />
                        </div>
                        <div class="text-center"><button type="submit" class="btn btn-color px-5 mb-5 w-100">Login</button></div>
                    </form>
                    </div>

                </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
