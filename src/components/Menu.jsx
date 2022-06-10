import React, { Component } from "react";
import "./Menu.css";

export default class Menu extends Component {
  render() {
    return (
      <div>
        <aside className="sidebar-mini main-sidebar  sidebar-dark-primary " style={{overflowX: 'hidden'}}>
          {/* Brand Logo */}
          <a href="#" class="brand-link logo-switch logo-scale">
            <img src="rabbitcard-logo.jpg" alt="Rabbitcard Logo Small" class="brand-image-xl logo-xs" style={{top:"0", left: "2px", maxHeight: "55px", width: "55px", padding: "0px", transition:"10s"}} />
            <img src="rabbitcard-logo.png" alt="Rabbitcard Logo Large" class="brand-image-xl logo-xl" style={{top:"0", left: "0px", maxHeight: "55px", width: "266px", padding: "0px"}} />
          </a>
          {/* Sidebar */}

          {/* SidebarSearch Form */}
          <div className="form-inline mt-2" style={{padding: "0px 10px"}}>
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>

          <div className="sidebar" style={{padding: "0px 0px 0px 0px"}}>
            {/* Sidebar user panel (optional) */}
            {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="image">
                <img
                  src="dist/img/user2-160x160.jpg"
                  className="img-circle elevation-2"
                  alt="User Image"
                />
              </div>
              <div className="info">
                <a href="#" className="d-block">
                  Alexander Pierce
                </a>
              </div>
            </div> */}
            {/* Sidebar Search form */}
            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column nav-collapse-hide-child"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {/* Add icons to the links using the .nav-icon class
                with font-awesome or any other icon font library */}
                {/* Sidebar Menu */}
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="fa fa-home nav-icon" />
                    <p>Home</p>
                  </a>
                </li>
                <li className="nav-item has-treeview">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-book" />
                    <p>
                      Management
                      <i className="right fas fa-angle-left" />
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>
                          Project
                        </p>
                      </a>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview">
                    <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>
                          User
                        </p>
                      </a>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview">
                    <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>
                          Permission
                        </p>
                      </a>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview">
                    <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>
                          Services
                        </p>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item has-treeview">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-book" />
                    <p>
                      Projects
                      <i className="right fas fa-angle-left" />
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>
                          Maintenance Fee
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <a href="#" className="nav-link">
                            <i className="far fa-dot-circle nav-icon" />
                            <p>Healthcheck</p>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#" className="nav-link">
                            <i className="far fa-dot-circle nav-icon" />
                            <p>Logs</p>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="nav-item has-treeview">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-cogs" />
                    <p>
                      Configuration
                      <i className="right fas fa-angle-left" />
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>
                          Con1
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <a href="#" className="nav-link">
                            <i className="far fa-dot-circle nav-icon" />
                            <p>Con2</p>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#" className="nav-link">
                            <i className="far fa-dot-circle nav-icon" />
                            <p>Con2</p>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
          {/* /.sidebar */}
        </aside>
      </div>
    );
  }
}
