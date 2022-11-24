import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function LoginForm({id,setId,password,setPassword}) {
  return (
    <>
      <FloatingLabel
        controlId="floatingInput"
        label="Student ID"
        className="mb-3"
        style={{width:"300px",fontSize:"15px", fontFamily:"Rubik"}}
      >
        <Form.Control type="email" style={{}} placeholder="name@example.com"  name="uid" onChange={ e => setId(e.target.value)}/>
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password" style={{fontSize:"15px", fontFamily:"Rubik"}}>
        <Form.Control type="password" placeholder="Password"  name="upw" onChange={ e => {console.log(e.target.value);return(setPassword(e.target.value))}}/>
      </FloatingLabel>
    </>
  );
}

export default LoginForm;