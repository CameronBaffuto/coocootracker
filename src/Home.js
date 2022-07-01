import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase.js";
import { set, ref, onValue, remove } from "firebase/database";
import { uid } from "uid";
import CalendarHeatmap from 'react-calendar-heatmap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack'
import Swal from 'sweetalert2';


function Home() {

const [values, setValues] = useState([]);
const [count, setCount] = useState("");
const [date, setDate] = useState("");
const [notes, setNotes] = useState("");
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
            notes: notes,
            time: new Date().toLocaleTimeString(),
            uidd: uidd,
        });
        setCount("");
        setDate("");
        setNotes("");
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

    const getmorning = values.filter(value => value.count === '1');
    const morningtime = getmorning.length;

    const getnight = values.filter(value => value.count === '2');
    const nighttime = getnight.length;

    const getboth = values.filter(value => value.count === '3');
    const bothtime = getboth.length;

    const getgood = values.filter(value => value.count === '4');
    const goodtime = getgood.length;

    const snapshot = () => {
        Swal.fire({
            title: 'Data since May 29, 2022',
            html: `<div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body yellowSquare">
                            <h5 class="card-title">Morning</h5>
                            <p class="card-text">${morningtime}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body blueSquare">
                            <h5 class="card-title">Night</h5>
                            <p class="card-text">${nighttime}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body redSquare">
                            <h5 class="card-title">Both</h5>
                            <p class="card-text">${bothtime}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body greenSquare">
                            <h5 class="card-title">Good</h5>
                            <p class="card-text">${goodtime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
            
    });
}
    

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

                <Form.Group className="mb-3">
                    <Form.Control as="textarea" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
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
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                        <th>Date</th>
                        <th>Code</th>
                        <th>Time</th>
                        <th>Notes</th>
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
                                <td>{value.notes}</td>
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

        <div className="container key">
            <h5>Key:</h5>
            <Stack direction="horizontal" gap={3}>
                <div className="yellowSquare border">Morning</div>
                <div className="vr" />
                <div className="blueSquare border">Night</div>
                <div className="vr" />
                <div className="redSquare border">Both</div>
                <div className="vr" />
                <div className="greenSquare border">Good</div>
            </Stack>
            <Button variant="outline-secondary mt-3" size="sm" onClick={snapshot}>Snapshot</Button>    
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

          onClick={value => Swal.fire({
        
                title: 'Date: ' + value.date + '<br>',
                html:
                    'Code: ' + value.count + '<br>' +
                    'Time: ' + value.time +'<br>' +
                    'Notes: ' + value.notes,
                showCloseButton: true,
            })}

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
