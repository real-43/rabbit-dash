import React from "react";
import "./Footer.css";

export default function Footer() {
  const objDate = new Date();
  const date = `${objDate.getDate()}/${objDate.getMonth()+1}/${objDate.getFullYear()}`;

  return (
    <div className="footer">
      <footer class="main-footer">
        <strong className="footer-content">
          Today: {date}
        </strong>
        <div class="float-right d-none d-sm-inline-block">
          <b>Version</b> 1.0.0
        </div>
      </footer>
    </div>
  );
}
