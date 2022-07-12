import { useState } from "react"

function popup() {

    const [newName, setNewName] = useState(props.currentName)
    const [newPassword, setNewPassword] = useState(props.currentPassword)
    const [role, setRole] = useState(props.currentRole)
    const [isActive, setActive] = useState(false)
    const [isOpen, setIsOpen] = useState(props.isOpen)

    // To show/unshow pass in edit popup
    function displayOption() {
        setActive(!isActive);
        var x = document.getElementById("myInput");

        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }
    
    return (props.isOpen) ? (
      <div>
        <Modal show={true} onHide={(e)=>{props.onClose}}>
          <Modal.Header>
            <Modal.Title>Edit User<i onClick={(e) => {props.onClose}} style={{cursor:"pointer", marginLeft:"330px"}} className='fa fa-times'/></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={props.changeUserName}
                  value={newName}
                  onChange={(e) => {props.nameChange}}
                  autoFocus
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3">
                  
                  <FormControl
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    id='myInput'
                    type="password"
                    placeholder="password"
                    value={newPassword}
                    onChange={(e) => props.passChange}
                  />
                  <Button variant="outline-secondary" id="button-addon1" onClick={(e) => displayOption(this)}>
                    <i class={isActive ? "fa fa-eye" : "fa fa-eye-slash"} id="togglePassword"/>
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select aria-label={role} defaultValue={role} onChange={(e) => setRole(e.target.value)}>
                <option className="d-none" value="">{role}</option>
                <option value="">Set No role</option>
                {roles.filter(obj => checkDomainRole(obj)).map((role,i) => {return (
                  <option value={role.name} key={i}>{role.name}</option>
                )})}
              </Form.Select>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={(e) => {props.onClose}}>
              Close
            </Button>
            <Button variant="primary" onClick={(e) =>{handleChange(changeUser)}}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    ) : ""
  }