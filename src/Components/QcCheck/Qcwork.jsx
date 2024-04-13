import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Qcwork.css'; // Importing the CSS file
import { ToastContainer, toast } from 'react-toastify';

const Qcwork = () => {
  const [qcWork, setQcWork] = useState([]);
  const token = sessionStorage.getItem('token');
  const users = sessionStorage.getItem('user');
  const user = JSON.parse(users);
  const trimPersonName = user.userName;

  const fetchDataForQc = async () => {
    try {
      const res = await axios.get(`https://sample-tracking.onrender.com/api/v1/qc/${trimPersonName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res.data.data)
      if (res.data.data.length === 0) {
        setQcWork("No work assigned for the trim department person.");
      } else {
        setQcWork(res.data.data);
      }
    } catch (error) {
      console.log("Trim-Person Error:", error);
    }
  };

  useEffect(() => {
    fetchDataForQc();
  }, []);

  const handleChangeStatus = async (id) => {
    // Prompt the user for a remark
    const remark = window.prompt("Please enter your remark:");

    // If the user cancels the prompt or enters an empty string, do nothing
    if (!remark) return;
    
    const status = {
        comment: "Completed",
        whichDepartment: user.department, // Corrected typo in department
        PersonName: trimPersonName,
        Reviews: remark // Include the remark in the status object
    };
console.log(status)
    try {
        const response = await axios.post(`https://sample-tracking.onrender.com/api/v1/update-status-work/${id}`, {
            status
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        toast.success("Work Updated");
        console.log("Updated", response);
        fetchDataForQc();
    } catch (error) {
        console.log(error);
    }
};

  return (
    <div className="qc-table">
      <ToastContainer/>
      {Array.isArray(qcWork) && qcWork.length > 0 ? (
        <table className="qc-table">
          <thead>
            <tr>
              <th>SRF No.</th>
              <th>Style Name</th>
              <th>Days</th>
              <th>Task Started Date</th>
              <th>Task Ended Date</th>
              <th>Total Quantity</th>
              <th>Work Assigned To</th>
              <th>Status</th>
              <th>Remark</th>

              <th>Comment By Manager</th> {/* New column for Comment */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {qcWork.map((item, index) => (
              <tr key={index}>
                <td>{item.srfNo}</td>
                <td>{item.styleName}</td>
                <td>{item.days}</td>
                <td>{item.assignDate}</td>
                <td>{item.endDate}</td>
                <td>{item.numberOfPcs}</td>
                <td>
                  {item.WorkAssigned.map((work, idx) => (
                    <div key={idx}>
                      {work.department === "QC CHECK" && (
                        work.NameOfPerson
                      )}
                    </div>
                  ))}

                </td>
                <td>
                  {item.WorkAssigned.map((work, idx) => (
                    <div key={idx}>
                      {work.department === "QC CHECK" && (
                        work.stauts
                      )}
                    </div>
                  ))}

                </td>
                <td> {/* New column for Comment */}
                  {item.WorkAssigned.map((work, idx) => (
                    <div key={idx}>
                      {work.Comment}
                    </div>
                  ))}
                </td>
                <td>
                {item.WorkAssigned.map((work, idx) => (
                    <div key={idx}>
                      {work.department === "QC CHECK" && (
                        work.Reviews || "No Remark"
                      )}
                    </div>
                  ))}
                </td>
                <td>
                  {item.WorkAssigned.map((works, idxz) => (
                    <button className='btn' onClick={() => handleChangeStatus(works._id)}>Mark complete work</button>
                  ))}
                </td>
                {/* Add more table cells for other details */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="qc-message">{qcWork}</div>
      )}
    </div>
  );
};

export default Qcwork;