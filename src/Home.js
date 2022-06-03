import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase.js";
import { set, ref, onValue } from "firebase/database";
import { uid } from "uid";
import CalendarHeatmap from 'react-calendar-heatmap';


function Home() {

const [values, setValues] = useState([]);
const [count, setCount] = useState("");
const [date, setDate] = useState("");
const [isUser, setIsUser] = useState(false);
const [isMobile, setIsMobile] = useState(true);

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
        });
        setCount("");
        setDate("");
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
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <select value={count} onChange={(e) => setCount(e.target.value)}>
                <option value="">Select</option>
                <option value="1">Morning</option>
                <option value="2">Night</option>
                <option value="3">Both</option>
            </select>
            <button onClick={write}>Write</button>
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