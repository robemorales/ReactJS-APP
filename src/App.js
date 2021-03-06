import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
//Here in call bootstrap for styles, reactstrap for modal and axios for comunication with API
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Label, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';   
function App() {
  const baseURL = "https://localhost:7127/api/manager";
  const [data, setData]=useState([]);
  const [modalInsert, setModalInsert]=useState(false);
  const [modalEdit, setModalEdit]=useState(false);
  const [modalDelete, setModalDelete]=useState(false);
  const [userSelected, setUserSelected] = useState({
    id: '',
    name: '',
    last: '',
    address: '',
    phone: ''
  });

  const handleCharge=e=>{
    const{name, value}=e.target;
    setUserSelected({
      ...userSelected,
      [name]: value
    });
  }
//method to open the modal for insert 
  const openCLoseModalInsert=()=>{
    setModalInsert(!modalInsert);
  }
  const openCLoseModalEdit=()=>{
    setModalEdit(!modalEdit);
  }
  const openCLoseModalDelete=()=>{
    setModalDelete(!modalDelete);
  }
  const userSelect_Update = (user, caso)=>{
    setUserSelected(user);
    (caso === "Edit")?
    openCLoseModalEdit(): openCLoseModalDelete();
  }

  //the request most be async because need work in backgroud
  const getRequest=async()=>{
    await axios.get(baseURL).then(response =>{
      setData(response.data);
    }).catch(error=>{console.log(error)});
  }

  const postRequest=async()=>{
    //first i delete the element id bacause this atribute is auto-incremenet
    delete userSelected.id;
    await axios.post(baseURL, userSelected).then(response =>{
      setData(data.concat(response.data));
      openCLoseModalInsert();
    }).catch(error=>{console.log(error)});
  }
  const putRequest=async()=>{

    await axios.put(baseURL+"/"+userSelected.id, userSelected).then(response =>{
      var resp = response.data;
      var dataAux =  data;
      dataAux.map(user=>{
        if(user.id === userSelected.id){
            user.name = resp.name;
            user.last = resp.last;
            user.address = resp.address;
            user.phone = resp.phone;
        }
      })

      openCLoseModalEdit();
    }).catch(error=>{console.log(error)});
  }
  const deleteRequest=async()=>{
    await axios.delete(baseURL+"/"+userSelected.id).then(response =>{
      setData(data.filter(user => user.id!==response.data));
      openCLoseModalDelete();
    })
    
  }
 
 
  useEffect(()=>{
    getRequest();
  },[])
  
  
  return (
    <div className="App">
    <br></br>
    <button className='btn btn-success' onClick={()=>openCLoseModalInsert()}>Insert</button>
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>LastName</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {data.map(user=>(
          <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.last}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
                <td>
                    <button className="btn btn-warning" onClick={()=>userSelect_Update(user, "Edit")}>Edit</button>{" "}
                    <button className="btn btn-danger" onClick={()=>userSelect_Update(user, "Delete")}>Delete</button>
                  </td>
          </tr>       
          ))}
          </tbody>
        </table>
 
        <Modal isOpen={modalInsert}>
          <ModalHeader>Insert a new User</ModalHeader>
          <ModalBody>
            <div className='form-group'>
              <label>Name: </label>
              <br />
              <input type="text" className='form-control' name='name' onChange={handleCharge}/>
              <label>LastName: </label>
              <br />
              <input type="text" className='form-control' name='last' onChange={handleCharge} />
              <label>Address: </label>
              <br />
              <input type="text" className='form-control' name='address' onChange={handleCharge} />
              <label>Phone: </label>
              <br />
              <input type="text" className='form-control' name='phone' onChange={handleCharge} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-primary'onClick={()=>postRequest()} >Insert</button>{"  "}
            <button className='btn btn-danger'onClick={()=>openCLoseModalInsert()}>Cancel</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEdit}>
          <ModalHeader>Update User</ModalHeader>
          <ModalBody>
            <div className='form-group'>
              <label>Id: </label>
              <input type="text" className='form-control' readOnly value={userSelected && userSelected.id}/>
              <br/>
              <label>Name: </label>
              <br />
              <input type="text" className='form-control' name='name' onChange={handleCharge} value={userSelected && userSelected.name}  />
              <label>LastName: </label>
              <br />
              <input type="text" className='form-control' name='last' onChange={handleCharge} value={userSelected && userSelected.last}/>
              <label>Address: </label>
              <br />
              <input type="text" className='form-control' name='address' onChange={handleCharge} value={userSelected && userSelected.address} />
              <label>Phone: </label>
              <br />
              <input type="text" className='form-control' name='phone' onChange={handleCharge} value={userSelected && userSelected.phone} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-primary'onClick={()=>putRequest()} >Edit</button>{"  "}
            <button className='btn btn-danger'onClick={()=>openCLoseModalEdit()}>Cancel</button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={modalDelete}>
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
          <ModalFooter>
            <button className='btn btn-danger'onClick={()=>deleteRequest()} >Yes</button>{"  "}
            <button className='btn btn-secondary'onClick={()=>openCLoseModalDelete()}>No</button>
          </ModalFooter>
        </Modal>
        </div>
    </div>
  );
}

export default App;
