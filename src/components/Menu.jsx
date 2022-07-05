import React, { useState, useEffect } from "react";
import "./Menu.css";
import { auth, db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function Menu() {

  const projectsR = useSelector((state) => state.firebase.allProjects)

  const [projects, setProjects] = useState([...projectsR]);
  const [role, setRole] = useState(useSelector((state) => state.firebase.currentUserFS)); 
  const menu = useSelector((state) => state.firebase.currentRoleFS);

  const navigate = useNavigate();

  const checkMenu = (menuCheck) => {
    var permission = null

    if (menuCheck === "Management" && menu !== undefined) {

      if (menu?.Management !== undefined) {
        permission = true
      }
    } else if (menu !== undefined) {
      menu.project?.map((p) => {
        // console.log(p.name,menuCheck)
        if(p.name === menuCheck) {
          permission = true
        }
      })
    }
    // console.log("menuCheck",menu.Management);
    return permission
  }

  useEffect(() => {
    setProjects([...projectsR])
  }, [projectsR])

  const checkSubMenu = (subMenuCheck) => {
    var permission = null
    var i = 0
    if (menu !== undefined) {
      menu?.project.map((p) => {
        if (p.subMenu.includes(subMenuCheck)) {
          permission = true
        }
      })
    }
    return permission
  }

  const user = auth.currentUser || {email: ""};

  return (
    <div>
      <aside className="sidebar-mini main-sidebar  sidebar-dark-primary " style={{overflowX: 'hidden'}}>
        {/* Brand Logo */}
        <a onClick={() => navigate("/dashboard")} style={{cursor: "pointer"}} class="brand-link logo-switch logo-scale">
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBMUEhISEBISEhISExIbEhQTGBISGhISFxQYGBgUGhcbIiwkGx0pHhoVJTYlKi4wMzMzGiI5PjkyPSwyMzABCwsLEA4QHhISHTIpJCkyMjIyMDIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIwMjIyMjIyMP/AABEIAN8A4wMBIgACEQEDEQH/xAAbAAEAAwADAQAAAAAAAAAAAAAAAQUGAwQHAv/EADsQAAIBAgMEBwcCBAcBAAAAAAABAgMRBAUhEjFBUQYiMmFxgbETQlKRocHRkuEWI3KCFUNTYnPC8BT/xAAaAQEAAwEBAQAAAAAAAAAAAAAABAUGAwEC/8QAMREAAgIBAgQBCgcBAAAAAAAAAAECAwQRMQUSIUETFCIyUVJhgZGx8EJicaHB0eEj/9oADAMBAAIRAxEAPwC7ABiTWAAAAAAAEunK13F252dvmQetaDUAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJZZBhFUrJTV4wW01zfBFYX/RHt1P6I+pKwoqV8U/WRsyTjTJo1OwrWsrciizXIYzvKilCfGK0jL8MvxY011ELY8sl0KCu2dcuaLPNpwabjJNNOzT0syDXZ9lXtI7cF14rVfGuXiZIzGVjSx58r27M0GNkK6OvfuQACMSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXHRips4iz9+El56P7FOc2ErezqQn8Mk/Lc/pc7Y9nh2xl7zlfDnrlH3HolyT4hK6T5n2a8zBDMj0ky7Yl7WC6k31l8M+fma84MVQjUhKEldSTT/ACR8rHV9bi/h+p2x7nTNSXxPOwc2Kw7pznCW+L+a4M4TJtNPRmlTTWqAAPD0AAAAkJAEAuMv6P1J2lU/lw5e8/Lh5mioZTRjFxUItPtOWrfmWFHDbbVq+n6kG7Prg9F1MKDQZn0ecbzodZcYPevB8TPyVnZqzW9PgyLfj2Uy0miRTfC1axYABxOwAAAAAAAAAAAAAABKIBIBtOj2K9pRim+tDqvy3P5WLUxfR3GbFVRfYqaPulwf28zaI1ODf4tKfddGZzLq8O1rs+qJIZIJpGMz0qweka0Vu6s/DgzNHoeMoKpCcHulFo89qQcZOL3xbT8UZ3ilPLYprv8AVF1w23mg4Pt9CAAVZZAA58Hh/aVIQXvSSfhx+lz6jFyaS3Z5JqKbfY7eX5NUq2lbYi/elxXcuJp8vyqnS1jG8uM5avy5HdhFJJLckkvBHKafHwa6eumr9Znb8uy7fb1HykfQBNIx8tFXmuTwqraXUn8S490uZbEM521xsjyyWqPqE5QlzRfU87xWGnTk4TWzJfJrmmcJvMxy+FaOzPeuzJb4sxWNws6c3Ca1W58JLmjN5mFKh6rrEvsXLVy0fpHAACCTAAAAAAAAAAAAAAACbm2yXHe1pJvtx0n4rj5mIO7lWOdGope49JrnHn4onYGT4NnXZ9GRM3H8Wvputv6N6iTipzUkpRd00mmuKOU06epnj5Zi+kmH2K7a3Tipee5+htjilSi2m4xbW5tJteDI+XjLIhy66HfGvdM+bTU8/p4SrLs05y8IyZy/4ZW/0qn6Wb8kgrg9feT/AGJj4nP2UedVMLUj2oVI+MZFv0Vw96k5tdiNl4y/ZfU1rPiNNK9klffZJXPunhkarFNS10++x8W58rIODjucgALQrwDgxWIjThKc3aMVr+DL0ekk1OTmlKDekVo4rknx8yNfl10tKb3O9WPZam4rY14Ohg8zpVexNX+GWjXk953UzvGcZLWL1OLi4vRo+itzfL1Wptbpx1g+/l4MsiGJwU4uMtmexk4yUlujzacWm1JWabTXJreiC36S0FGvtLTbim/FafgqDIX1+FZKHqNNTZ4kFP1gAHI6AAAAAAAAAAAAAlEH1SpynKMYq8pNJLvPUteiDenVl/0Xxk7uk05Qs2n8Hc+5mpR0cswEaNNRXa3zfxS/B3kazErnXUozerM1kWRsscorREgEXJJwJBFyL+B5qD6BAuegkhkgAyHSbFTdT2bTjTjqv9z5lIbrNcBGtBxeklrF8n+DDVKbjJxkrSi2muTRmuJUzhbzt6p7e73F7w+2Mq+VdGt/7ITLDC51Xp6KW3HlPrfXf9SuBCrtnW9YPQmTrhYtJLU01LpOv8ym/wC1p/RnLLpPSs7QqN8E9lfW5lAS1xPIS01XyIr4fS3rp+52cwxsq03OWnBJe6uR1gCFObnJyluyXCKguVbAAHyfQAAAAAAAAAAAAND0Wwd3KrJburDx4v7GfubvKKGxQpx47Kb8Zav1LLhdXPbzPt9ogcRs5auVdzvEgg0hRApc2zyNK8IJSnx10j49/cc+d4/2VJtduWkO58X5GJbb1bu3vffzKrPznV/zhv39xYYWGrfPnt9TtYrMqtTtzlb4YvZX0Ottvm/mz5BQysnLq2/mXUa4xWiSO5hszrU+zOVuUusvkzS5TncavUklCpyvpLw/BjhGTTTTs1ua4PmScfOspe+q9TI9+HXattH60elXJKvJMd7Wkm+1HSfjz8y0NPXNWRUo7Mz0ouEnGW6Ploy3SnBWlGrHdLqz/q4M1ZX51Q26FRcVG68VqccylW0uL+B2xrfDsUjCkBAyRpQAAAAAAAAAAAAAAAAAAAACYq7S5tHo0Folyt6HnMXZrua9T0anK6T5pehd8H/H8P5Knin4Pj/ByEEkF2VJkullRurCPCML+bf7FEX3SylapCfCULecX+5QmUztfKJ6mjwtPAjoAARCSACQC86J1LVJx4Sgn5xf7muMn0So3nUnwjFLzbv9jWGn4Zr5PHX3mfz9PHegOOtG8ZLmn6HIcVd2jJ8ov0J0tiGedWIF+PMGLe5rFsAAeAAAAAAAAAAAAAAAAAAAG6yWvt0Kb4qOy/GOhhi96L4zZnKlJ6T1j3TtqvNehY8MuVd2j79CDxCrnq5l26msQCJNKUJXZxgfbU3H3lrF8ny89xh5wcW4yTUk7NPgz0hlZmeUQravqzS0mvRriitz8F3+fD0l+/8ApOw8vwfNlt9P8MSQWeJyKvDdHbXBw1+m86n/AMNW9vZVP0yKGVFsXo4v5Muo31y6qS+Z1z6p03JqMVeUnZLmyww+RV5vWKguc/wtTS5ZlNOjqutN75P7ciTjcPttfnLRe/o/gRr86utea9WfeVYH2NNR02nrJ85FgSDSwgoRUVsihlJybb7grM9r7FCb4yWyvGWnpcsWzJ9JsbtTVOL6sNZf1vh5L1I+bcqqW++y/U74tXi2qPxZRkEkGTNIAAAAAAAAAAAAAAAAAAAAACYTaalF2ad0+TRBIBtsozFVoa6TjpNfddzLNHnWFxEqc1ODtJfVcmuRscqzeFZW7M0tYvj3rmjSYOfG1cs/S+pQ5eG6nzR9H6FqD5RJZEEWBIAIsLEgAEAq80zeFFNLrz4RXDvk+B8WWRrjzSeiPqEJTfLFasnOMyVGGmtSV9hf9n3GJlJttt3bbbb4t8TkxOIlUm5zd5P/ANZLkcRmMzLeRPXstv7NBi4yoj13e4ABDJQAAAAAAAAAAAAAAAAAAAAAAABITs7p2a3NaWZBIBc4HpDOFo1F7SPPdJefEvcNnVCfv7DfCfV+u4zOX5RUq2lFKMH70uPguJoMH0fpQ1mvaS5y3fpLzCnlyX5fzfepT5UMVN6b+4t4zTV001zWp9nHCCSskkuS0OQukVZDKzGZzRp3UpbUlvjFXaffyLNlPneVKrFygkqkVo/iXws4ZDsUG69NTpSoOaVmxTY7pBUnpTXs4898n58PIp276vV8W+ItzIMtddO16zeppKqYVLSCAAOJ0AAAAAAAAAAAAAAAAAAAAAAAAAAABK793EgAb9D0TDxioRUeyoq3hY5kYvL89nTioNKcVuu2mlyuWeW5xOtWjBRjCNpOVus3Zc+HA09PEKZ6RW77aGeswrYatrp69TRAhEk8iAhkgAxXSPCbFbaXZmtr+7c/t8ypNrnWWutGCi1Fxlvfwta/Yq59GJJdWom+TVk/Mz2XgWu2Uq49C6xs2tVpTej2M8DlxGHnTm4TWzJenNPijiKtpxejLFNNaoAA8PQAAAAAAAAAAAAAAAAAAAAAAAAAAAXfRRfzpf8AG/VFThqW3OEG7bUoq/K7Ntgstp0tYRs7Wbd22iy4djynZ4i2iQM++MIOt7tHfRJCJNIUQAIYB0c2ryp0Zzh2ktONu8yuX5jWVWHWnLaklKLbd03y4eRqcfmFOlKMKuimpa2utLb/AJnSp1cFTe3B078Nm8n5LgVuVW7LE42KPLuvvfUm481Ctpw1126HW6WU47NOfvbTV+atczRYZxmLrSTStCPYT797fedAps62Ft0pQ2LXDrlXUoy3IABEJQAAAAAAAAAAAAAAAAAAAAAAAAAAAT4lnDPcQlbbT8YpsqyTpXdOv0HofE6oWemtS2/iHEc4fpQ/iLEc4fpRUg6+WX+2zn5LT7KLb+IsR8Uf0ofxDiPij+lFSB5Zf7b+Y8lp9lHLicTOpLaqScpei5JHEAR5NyesurO8UorRbAAHgAAAAAAAAAAAAAAAP//Z" alt="Rabbitcard Logo Small" class="brand-image-xl logo-xs" style={{top:"0", left: "2px", maxHeight: "55px", width: "55px", padding: "0px", transition:"10s"}} />
          <img src='rabbitcard-logo.png'  alt="Rabbitcard Logo Large" class="brand-image-xl logo-xl" style={{top:"0", left: "0px", maxHeight: "55px", width: "266px", padding: "0px"}} />
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
              <li onClick={() => navigate("/dashboard")} style={{cursor: "pointer"}} className="nav-item">
                <a className="nav-link">
                  <i className="fa fa-home nav-icon" />
                  <p>Home</p>
                </a>
              </li>
              {((checkMenu("Management"))) ? (
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
                    <a onClick={() => navigate('/managementProject')} style={{cursor: "pointer"}} className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>
                        Project
                      </p>
                    </a>
                  </li>
                </ul>
                <ul className="nav nav-treeview">
                  <li className="nav-item has-treeview">
                    <a onClick={() => navigate('/managementUser')} style={{cursor: "pointer"}} className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>
                        User
                      </p>
                    </a>
                  </li>
                </ul>
                {(role.role.includes("Admin")) ? (
                <ul className="nav nav-treeview">
                  <li className="nav-item has-treeview">
                    <a onClick={() => {if (role.role === "Admin") {
                      navigate('/permission')
                    }else {
                      navigate('/permissionOthers')
                    }}} className="nav-link" style={{cursor: "pointer"}}>
                      <i className="far fa-circle nav-icon" />
                      <p>
                        Permission
                      </p>
                    </a>
                  </li>
                </ul>
                ) : ""}
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
              ) : ""}






              <li className="nav-item has-treeview">



                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-book" />
                  <p>
                    Projects
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>





                <ul className="nav nav-treeview"> 
                {projects?.map((project) =>(
                  <div>
                  {(checkMenu(project.name)) ? (
                    <li className="nav-item has-treeview">

                 


                      <a href="#" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>
                          {project?.name}
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>


                        {project.subMenu?.map((submenu, i) =>(
                          
                                    <ul className="nav nav-treeview">
                                      {(checkSubMenu(submenu)) ? (
                                          <li className="nav-item">
                                            <a onClick={() => navigate(`${project.name}${submenu}`)} className="nav-link" style={{cursor: "pointer"}}>
                                              <i className="far fa-dot-circle nav-icon" />
                                              <p>{submenu}</p>
                                            </a>
                                          </li>
                                      ) : ""}

                                    </ul>
                        ))}
                  
                    </li>
                  ) : ""}
                  </div>
                ))}
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
  )
}
