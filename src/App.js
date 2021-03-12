import React, { useState } from 'react';
import './App.css';
import { parse } from 'papaparse';
import IncorrectDataComponent from './Components/IncorrectData/incorrectDataComponent';

let App = () => {
  let [designBtn, setDesignBtn] = useState(false);
  let [warningComponent, setWarningComponent] = useState(false);
  let [allData, setAllData] = useState([ 
    {'id': '1', 'Full_Name': 'Alex Cho', 'Phone': '+18900911919	', 'Email': 'cho.cho', 'Age': '12',
     'Experience': '45', 'Yearly_Income': '1200', 'Has_children': 'TRUE',
     'License_states': 'Alabama', 'Expiration_date': '12-15-2030', 'License_number': '1xr567'} ]);
  return (
    <div className="wrapper">
      <div 
      onDragEnter={() => {
        setDesignBtn(true); 
      }} 
      
      onDragLeave={() => {
        setDesignBtn(false);
      }}

      onDragOver={(e) => { e.preventDefault(); }}

      onDrop={(e) => {
         e.preventDefault();
         setDesignBtn(false);
         warningComponent ? setWarningComponent(false) : console.log('warning component is open');
         Array.from(e.dataTransfer.files)
         .filter( file => file.type === "application/vnd.ms-excel" ? file : setWarningComponent(true) ) //text/csv 
         .forEach(async (file) => {
           let text = await file.text();
           let result = parse(text, {header: true})
           console.log(result);
           setAllData(existing => [...existing, ...result.data])
           console.log(allData);
         })
       }} className={`btnDrop ${designBtn ? 'onDragEnter' : 'onDragLeave'}`}>Drop here your .csv file</div>


       {warningComponent ? <IncorrectDataComponent /> :
      <table>
          <thead>
            <tr>
              <td>Full Name</td>
              <td>Phone</td>
              <td>Email</td>
              <td>Age</td>
              <td>Experience</td>
              <td>Yearly Income</td>
              <td>Has children</td>
              <td>License states</td>
              <td>Expiration date</td>
              <td>License number</td>
              </tr>
          </thead>
          {allData.map(item => (
            (item.Full_Name && item.Full_Name.trim().length > 0) && 
            (item.Email && item.Email.trim().length > 0) &&
            (item.Phone && item.Phone.trim().length > 0) ?
          <tbody key={item.id}>
                <tr>
                  <td>{item.Full_Name.trim()}</td>
                  
                  <td className={item.Phone.match(/(^(1|\+1)?([0-9]{10}))/) ?
                     '' : 'redArea'}>{item.Phone}</td>

                  <td>{item.Email}</td>

                  <td className={item.Age === 0 || item.Age < 21  ?
                     "redArea" : ''}>{item.Age}</td>

                  <td className={item.Experience <= 0 || item.Experience > item.Age ?
                     'redArea' : ''}>{item.Experience}</td>

                  <td className={item.Yearly_Income <= 0 || item.Yearly_Income >= 1000000 ?
                     'redArea' : ''}>{Number(item.Yearly_Income).toFixed(2)}</td>

                  <td className={(item.Has_children.toUpperCase() === 'TRUE') ||
                    (item.Has_children.toUpperCase() === 'FALSE') ? '' : 'redArea' }>
                    {item.Has_children === '' ? 'FALSE' : item.Has_children.toUpperCase()}</td>

                  <td>{item.License_states.trim().length === 2 ?
                    item.License_states : `${item.License_states.slice(0, 2).toUpperCase()} | ${item.License_states}`}</td>

                  <td className={item.Expiration_date === 0 ||
                  item.Expiration_date !== new Date(item.Expiration_date).toISOString().substring(0, 10) ?
                    'redArea' : ''}>{item.Expiration_date}</td>
                  
                  <td className={item.License_number.match(/[a-zA-Z0-9]{6}/) ?
                     '' : 'redArea'}>{item.License_number}</td>
                </tr>
            </tbody> : setWarningComponent(true)
          ))}
      </table>}
    </div>
  );
}

export default App;
