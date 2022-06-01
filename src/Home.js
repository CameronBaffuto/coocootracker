import React, { useEffect, useState } from "react";
import { db } from "./firebase.js";
import { set, ref, onValue, remove } from "firebase/database";
import { uid } from "uid";


function Home() {

const [values, setValues] = useState([]);
const [count, setCount] = useState("");

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

console.log(values);    

//write to the database
    const write = () => {
        const uidd = uid();
        set(ref(db, `/values/${uidd}`),{
            // date: date,
            count: count,
        })

        setCount("");
    }


  return (
    <div>
        <h1>Home</h1>
        <input type="text" value={count} onChange={(e) => setCount(e.target.value)} />
        <button onClick={write}>Write</button>

        <div className="mt-5">
            {values.map((value) => {
                return (
                    <div>
                        {value.count}
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Home