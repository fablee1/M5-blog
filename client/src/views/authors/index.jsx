import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from 'react-router-dom'
import "./styles.css"

const Authors = props => {

    const [authors, setAuthors] = useState([])

    const fetchAuthors = async () => {
        const response = await fetch("http://localhost:3001/authors")
        if(response.ok) {
            const data = await response.json()
            setAuthors(data)
        } else {
            console.log('error fetching authors')
        }
    }
    
    useEffect(() => {
        fetchAuthors()
    }, [])

    return (
        <div className="authors">
            <Container>
                <div className="d-flex header">
                    <h1>AUTHORS</h1>
                    <Button as={Link} to="/authors/add" className="ms-auto add-author">Add Author</Button>
                </div>
                <Row>
                    {
                        authors === [] ?
                        <h2>No Authors Exist</h2>
                        : authors.map(author => <AuthorCard {...author} />)
                    }
                </Row>
            </Container>
        </div>
    );
}

export default withRouter(Authors);


const AuthorCard = (props) => {
    return (
        <Col xs={12} md={6} xl={4}>
            <Card>
                <Card.Body className="author-card">
                    <div className="d-flex">
                        <img src={props.avatar} alt="" />
                        <div className="author-card-info">
                            <Card.Title>{props.name} {props.surname}</Card.Title>
                            <Card.Text><strong>Email: </strong>{props.email}</Card.Text>
                            <Card.Text><strong>DOB: </strong>{props.dob}</Card.Text>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
}