import React from 'react'
import Loader from './CircleLoader'

export default function Loading(props) {
    return (props.isLoading) ? (
        <div className='loading-container'>
            <div className='loading-wrapper'>
                <Loader />
            </div>
        </div>
      ) : "";
}
