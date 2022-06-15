import React, { useState } from "react";
import "./Footer.css";

export default function Footer() {
  const [objDate, setObjDate] = useState(new Date())

  function callTime() {
    setInterval(() => {
      setObjDate(new Date())
    }, 1000)
  }

  return (
    <div className="footer">
      <footer class="main-footer">
        <strong className="footer-content">
          Today: {`${objDate.getDate()}/${objDate.getMonth()+1}/${objDate.getFullYear()}`} {objDate.toLocaleTimeString()}
          {callTime()}
        </strong>
        <div class="float-right d-none d-sm-inline-block">
          <b>Version</b> 1.0.0
        </div>
      </footer>
    </div>
  );
}
