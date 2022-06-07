import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase.js";
import { set, ref, onValue, remove } from "firebase/database";
import { uid } from "uid";
import CalendarHeatmap from 'react-calendar-heatmap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';


function Home() {

const [values, setValues] = useState([]);
const [count, setCount] = useState("");
const [date, setDate] = useState("");
const [isUser, setIsUser] = useState(false);
const [isMobile, setIsMobile] = useState(true);
const [open, setOpen] = useState(false);
const [open2, setOpen2] = useState(false);

const handleClose = () => setOpen(false);
const handleShow = () => setOpen(true);

const handleClose2 = () => setOpen2(false);
const handleShow2 = () => setOpen2(true);

useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            setIsUser(true);
        }
    })
})

//read from database
useEffect(() => {
    onValue(ref(db, `/values/`), (snapshot) => {
      setValues([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((values) => {
          setValues((oldArray) => [...oldArray, values]);
        });
      }
    });
    }, []);   

//write to the database
    const write = () => {
        const uidd = uid();
        set(ref(db, `/values/${uidd}`),{
            date: date,
            count: count,
            time: new Date().toLocaleTimeString(),
            uidd: uidd,
        });
        setCount("");
        setDate("");
        setOpen(false);
    }

//delete the database
const deleteItem = (uid) => {
    remove(ref(db, `/values/${uid}`));
    // setShow2(false);
    
}

    const checkMobile = () => {
        if (window.innerWidth <= 800) {
            setIsMobile(false);
        } else {
            setIsMobile(true);
        }
    }

    useEffect(() => {
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    });

  return (
    <div>
        <div className="text-center mt-4 mb-5">
        {
            isUser ? (
        <div>
            <Button className="m-3" variant="success" onClick={handleShow}>Add New</Button>
            <Button className="m-3" variant="warning" onClick={handleShow2}>Edit</Button>

            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add CooCoo Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Control placeholder="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Select value={count} onChange={(e) => setCount(e.target.value)}>
                        <option value="">Select</option>
                        <option value="1">Morning</option>
                        <option value="2">Night</option>
                        <option value="3">Both</option>
                        <option value="4">Good</option>
                    </Form.Select>
                </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={write}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={open2} onHide={handleClose2}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Date</th>
                        <th>Code</th>
                        <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                    {values
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((value) => {
                        return (
                            <tr>
                                <td>{value.date}</td>
                                <td>{value.count}</td>
                                <td>{value.time}</td>
                                <td>{value.uuid}</td>
                                {/* <td><Button variant="primary" onClick={() => deleteItem(value.uidd)}>Delete</Button></td> */}
                                <td><Button variant="danger" onClick={() => deleteItem(value.uidd)}>Delete</Button></td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose2}>Close</Button>
                </Modal.Footer>
            </Modal>

            
        </div>
        ) : (
        <div>
            <p>Not logged in</p>
        </div>
        )}
        </div>

        <div className="c">
        <CalendarHeatmap
          startDate={new Date('2022-05-29')}
          endDate={new Date('2022-12-31')}
          values={values}

          showWeekdayLabels={true}
          horizontal={isMobile}
          showOutOfRangeDays={true}

          classForValue={value => {
            if (!value) {
              return 'color-empty';
            }
            return `color-coo-${value.count}`;
          }}

          onClick={value => alert(`Code: ${value.count} | Date: ${value.date} | Time ${value.time}`)}

          tooltipDataAttrs={value => {
            return {
              'data-tip': `${value.date} has count: ${value.count}`, 
            };
          }}
        />
        {/* <ReactTooltip /> */}
    </div>
    </div>
  )
}

export default Home
