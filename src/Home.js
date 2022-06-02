import React, { useEffect, useState } from "react";
import { db } from "./firebase.js";
import { set, ref, onValue, remove } from "firebase/database";
import { uid } from "uid";
import CalendarHeatmap from 'react-calendar-heatmap';


function Home() {

const [values, setValues] = useState([]);
const [count, setCount] = useState("");
const [date, setDate] = useState("");

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

// const squares = values;
// console.log(squares);    

//write to the database
    const write = () => {
        const uidd = uid();
        set(ref(db, `/values/${uidd}`),{
            date: date,
            count: count,
            time: new Date().toLocaleTimeString(),
        });
        setCount("");
        setDate("");
    }

    // const time = new Date().toLocaleTimeString();
    // console.log(time);


  return (
    <div>
        <div className="text-center">
        <h1>Home</h1>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" value={count} placeholder="count" onChange={(e) => setCount(e.target.value)} />
        <button onClick={write}>Write</button>

        {/* <div className="mt-5">
            {values.map((value) => {
                return (
                    <div>
                        {value.count}
                        <br />
                        {value.date}
                    </div>
                )
            })}
        </div> */}
        </div>

        <div className="c">
        <CalendarHeatmap
          startDate={new Date('2022-05-29')}
          endDate={new Date('2022-12-31')}
          values={values}

          showWeekdayLabels={true}
          horizontal={true}
          showOutOfRangeDays={true}

          classForValue={value => {
            if (!value) {
              return 'color-empty';
            }
            return `color-coo-${value.count}`;
          }}

          onClick={value => alert(`Count: ${value.count} - Date: ${value.date} - time ${value.time}`)}

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