import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Profiles() {
  const [data, setData] = useState(null);
  const [refCode, setRefCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const res = await axios.get("/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res?.data?.userResult);
        setRefCode(res?.data?.referralCode);
      } catch (err) {}
    };

    fetchData();
  }, []);

  console.log(data);
  console.log(refCode);

  function getDateAndTime(timestamp) {
    const dateObject = new Date(timestamp);

    const date = dateObject.toISOString().split("T")[0];
    const time = dateObject.toTimeString().split(" ")[0];

    return { date, time };
  }

  return (
    <div className="user-profile">
      {data && data.length > 0 ? (
        <>
          <h1>Users registered using your referral code</h1>
          {refCode && refCode[0] && <h3>Your referral code: {refCode}</h3>}
          <table className="ref-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Registration Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((user, index) => {
                const { date, time } = getDateAndTime(user.created_at);
                return (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{date}</td>
                    <td>{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h1>No users registered using your referral code</h1>
          <h3>Your referral code: {refCode}</h3>
        </>
      )}
    </div>
  );
}
