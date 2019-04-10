import React from 'react';

export default function LoadingIndicator(props) {
    return (
        <span><i className="fa fa-spin fa-spinner" style = {{display: 'block', textAlign: 'center', marginTop: 30, color: 'orange'}}/></span>
    );
}
