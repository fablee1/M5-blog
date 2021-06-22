import { Container } from 'react-bootstrap';
import React, {useState} from 'react';

const checkEmail = () => {

    const [email, setEmail] = useState('')
    const [emailExists, setEmailExists] = useState(false)

    const checkEmail = async() => {
        console.log('checked')
    }

    return (
        <Container>
            <div>
                <h1>Check if your email is registered</h1>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={() => checkEmail}>Check</button>
            </div>
        </Container>
    )
}