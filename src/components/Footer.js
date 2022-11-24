import React from 'react';
import { MDBFooter, MDBIcon } from 'mdb-react-ui-kit';

const Footer = () => {
    return (
    <div style={{}}>
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
   
    <div className='text-center p-4' style={{fontFamily:"", backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      © 2022 Copyright: &nbsp;
      <h className='text-reset ' >
         Team-184
      </h>
    </div>
  </MDBFooter>
  </div>
    );
}

export default Footer;