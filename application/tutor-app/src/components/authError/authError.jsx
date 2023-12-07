// Author:  Cleveland Plonsey, Michael Mathews
// Date: 12/7/2023
// Purpose: 

// rectangle that shows an error with a x to click to close it

import React from 'react';
import './authError.scss';



export default function AuthError({ error, setErrorList }) {
    return (
        <div className="authError">
            <p className="authErrorText">
                {error}
            </p>
            <button className="error-button-close" onClick={() => setErrorList("")}>
                X
            </button>
        </div >
    )
}