import React from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const Navigation = ({ account }) => {
    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="">
                    &nbsp; Super Golden Lottery
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar navbar-dark bg-primary" />
                <Navbar.Collapse id="navbar navbar-dark bg-primary">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Tokens</Nav.Link>
                        <Nav.Link as={Link} to="/lottery">Lottery</Nav.Link>
                        <Nav.Link as={Link} to="/winner">Winner</Nav.Link>
                    </Nav>
                    <Nav className='ml-auto'>
                        <Nav.Link 
                        
                            href={`https://testnet.bscscan.com/address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button nav-button btn-sm mx-4"
                            
                            >
                             <Button variant="outline-light">
                            
                                {account.slice(0, 10) + '...' + account.slice(32, 42)}
                                👋 </Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;