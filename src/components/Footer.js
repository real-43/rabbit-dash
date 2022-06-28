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
        <div class="float-left d-none d-sm-inline-block" style={{fontSize: "10px"}}>
          Copyright © 2014-2021 AdminLTE.io. All rights reserved.
        </div>
        <strong className="float-center footer-content" style={{fontSize: "10px", textAlign: "center"}}>
          Today: {`${objDate.getDate()}/${objDate.getMonth()+1}/${objDate.getFullYear()}`} {objDate.toLocaleTimeString()}
          {callTime()}
        </strong>
        <div class="float-right d-none d-sm-inline-block" style={{fontSize: "10px"}}bb>
          <b>Version</b> 1.0.0
        </div>
      </footer>
    </div>
  );
}
