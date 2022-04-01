import 'bootstrap/dist/css/bootstrap.css';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import styles from '../../styles/auth.module.scss';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [errors, setErrors] = useState([]);
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password,
            role: 'admin'
        },
        onSuccess: (data) => Router.push('/')
    });
  
    const onSubmit = async event => {
        event.preventDefault();
        
        await doRequest();
    };
  
    return (
        <div className={styles.signUp}>
        <Container>
        <form onSubmit={onSubmit}>
            <div className={styles.form_centered} >
                <h1>Sign Up</h1>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        className="form-control"
                    />
                </div>
                
                {errors}
                {/* {errors ? (<div style={{color: 'red'}}>{errors.map(err => err.message)}</div>)
                        : null } */}
                <div>
                Already a user? Login <a href="/auth/signin">here</a>
                </div>
                <div className={styles.auth_buttoncontainer}>
                    <button className="btn btn-primary">Sign Up</button>
                </div>
            </div>
        </form>
        </Container>
        </div>
    );
};

export default SignUp;