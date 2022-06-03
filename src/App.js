import React, { useEffect, useState } from "react";
import './App.css';
import Home from './Home';
import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isUser, setIsUser] = useState(false);

useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            setIsUser(true);
        }
    })
})

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result)
        setEmail("")
        setPassword("")
        handleClose()
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleSignOut = () => {
    auth.signOut()
      .then(result => {
        console.log(result)
        window.location.reload(false);

      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">CooCoo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {
              isUser ? (
                <Button variant="outline-light" onClick={handleSignOut}>Sign Out</Button>
              ): (
                <Button variant="outline-light" onClick={handleShow}>Sign In</Button>
              )
            }
          
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
          {/* <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSignIn}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      <Home />

    </div>
  );
}

export default App;
