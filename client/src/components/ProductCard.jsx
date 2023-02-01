import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import Collapse from 'react-bootstrap/Collapse';


const ProductCard = ({
    product
}) => {
    const { name,
        id,
        url,
        price,
        image_url,
        brand,
        category,
        specifications } = product;
    const [open, setOpen] = useState(false);
    return (
        <Card style={{ width: '18rem' }} className="mt-3">
            <Card.Img variant="top" src={image_url} />
            <Card.Body>
                <Card.Title>{name}</Card.Title>

            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>Price : {(price.slice(0, 2) === "0 ") ? price.replace("0 ", " ") : price.replace("– ", "0 ").replace(". ", ".0 ")}</ListGroup.Item>
                <ListGroup.Item>Brand : {brand}</ListGroup.Item>
                {/* <ListGroup.Item>
                    <span>Specifications : </span>
                    <ul className='list-group list-group-flush'>
                        {React.Children.toArray(specifications.map(item => (<li className='list-group-item h6 small'> {item.key} :<br /> {item.value} </li>)))}
                    </ul>
                </ListGroup.Item> */}
                <ListGroup.Item>


                    <span
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        style={{ cursor: "pointer" }}
                    >
                        Specifications :
                    </span>
                    <Collapse in={open}>
                        <div id="example-collapse-text">
                            <ul className='list-group list-group-flush'>
                                {React.Children.toArray(specifications.map(item => (<li className='list-group-item h6 small'> {item.key} :<br /> {item.value} </li>)))}
                            </ul>
                        </div>
                    </Collapse>
                </ListGroup.Item>



            </ListGroup>
            <Card.Body>
                <Card.Link href={url}>More details</Card.Link>
            </Card.Body>
        </Card >

    )
}

export default ProductCard;