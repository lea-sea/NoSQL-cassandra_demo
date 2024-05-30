import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const AppDemo = () => {
  const [userData, setUserData] = useState([]);
  const [singleUserData, setSingleUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [creationDate, setCreationDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (singleUserData) {
      setCreationDate(singleUserData.primaryKey.creationDate);
      setUserEmail(singleUserData.primaryKey.userEmail);
      setName(singleUserData.name);
    }
  }, [singleUserData]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('api-demo/users');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadUsersByName = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api-demo/users/byName/${name}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadSingleUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api-demo/${userEmail}/${creationDate}`);
      setSingleUserData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const createUser = async (userData) => {
    try {
      const response = await axios.post('api-demo', userData);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`api-demo/${userEmail}/${creationDate}`, userData);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await axios.delete(`api-demo/${userEmail}/${creationDate}`);
      console.log('Data deleted successfully:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmitCreate = async () => {
    const userData = {
      primaryKey: {
        creationDate: new Date(creationDate).toISOString(),
        userEmail: userEmail,
      },
      name: name,
    };
    await createUser(userData);
  };

  const handleSubmitUpdate = async () => {
    const userData = {
      primaryKey: {
        creationDate: new Date(creationDate).toISOString(),
        userEmail: userEmail,
      },
      name: name,
    };
    await updateUser(userData);
  };

  const handleDelete = async () => {
    await deleteUser();
    setSingleUserData(undefined);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">UserDemo</h1>
      <div className="d-flex justify-content-center mb-4">
        <button onClick={loadSingleUser} disabled={loading} className="btn btn-primary mx-2">
          {loading ? 'Loading...' : 'Fetch single User'}
        </button>
        <button onClick={handleSubmitCreate} disabled={loading} className="btn btn-success mx-2">
          {loading ? 'Saving...' : 'Save User'}
        </button>
        <button onClick={handleSubmitUpdate} disabled={loading} className="btn btn-warning mx-2">
          {loading ? 'Saving...' : 'Update User'}
        </button>
        <button onClick={handleDelete} disabled={loading} className="btn btn-danger mx-2">
          {loading ? 'Deleting...' : 'Delete User'}
        </button>
      </div>
      <div>
        <form>
          <div className="form-group row m-2">
            <label htmlFor="country" className="col-sm-2 col-form-label font-weight-bold text-danger">
              CreatedDate*:
            </label>
            <div className="col-sm-10">
              <input type="datetime-local" className="form-control" id="country" value={creationDate} onChange={(e) => setCreationDate(e.target.value)} required />
            </div>
          </div>
          <div className="form-group row m-2">
            <label htmlFor="userEmail" className="col-sm-2 col-form-label font-weight-bold text-danger">
              Email*:
            </label>
            <div className="col-sm-10">
              <input type="email" className="form-control" id="userEmail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group row m-2">
            <label htmlFor="name" className="col-sm-2 col-form-label">Name:</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-center mx-4 mt-4" >
        <button onClick={loadUsers} disabled={loading} className="btn btn-primary w-100">
          {loading ? 'Loading...' : 'Load all Users'}
        </button>
      </div>
      <div className="d-flex justify-content-center">
  <div className="d-flex flex-column align-items-center w-50 m-4">
    <button onClick={loadUsersByName} disabled={loading} className="btn btn-primary mb-2 w-100">
      {loading ? 'Loading...' : 'Fetch all Users By Name (Filtering allowed)'}
    </button>
    <div className="form-group w-100">
      <label htmlFor="name" className="font-weight-bold text-danger">Name:</label>
      <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  </div>
</div>
  {userData.length > 0  ? 
    <table className="table table-striped m-4">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col" className='font-weight-bold text-danger'>Email</th>
          <th scope="col" className='font-weight-bold text-danger'>CreatedDate</th>
        </tr>
      </thead>
      <tbody>
        {userData.length > 0 ? userData.map((user) => (
          <tr key={user.primaryKey.creationDate}>
            <td>{user.name}</td>
            <td>{user.primaryKey.userEmail}</td>
            <td>{user.primaryKey.creationDate}</td>
          </tr>
        )) : <tr><td colSpan="5" className="text-center">No data available</td></tr>}
      </tbody>
    </table>
  : "" }
    </div>
  );

};

export default AppDemo;
