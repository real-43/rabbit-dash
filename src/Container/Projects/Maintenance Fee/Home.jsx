import React from 'react'

export default function HealCheck() {
  return (
    <div className='content-wrapper'>
        <h2>Mornitoring</h2>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">SOURCE TYPE</th>
                    <th scope="col">TRANSACTION DATE</th>
                    <th scope="col">SETTLEMENT DATE</th>
                    <th scope="col">TERMINAL ID</th>
                    <th scope="col">VALUE</th>
                    <th scope="col">TRANSACTION TYPE</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">LP</th>
                    <td>20/02/2021 07:49:21</td>
                    <td>unmatched</td>
                    <td>@2021-05-27T11:20:27.467Z</td>
                    <td>116.75</td>
                    <td>Purse Use</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>BOBO</td>
                    <td>bebe</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                    <td>BOBO</td>
                    <td>bebe</td>
                </tr>
            </tbody>
        </table>    
    </div>
  )
}
