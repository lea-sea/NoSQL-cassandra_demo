import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [userData, setUserData] = useState([]);
  const [singleUserData, setSingleUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (singleUserData) {
      setCountry(singleUserData.primaryKey.country);
      setUserEmail(singleUserData.primaryKey.userEmail);
      setFirstName(singleUserData.firstName);
      setLastName(singleUserData.lastName);
      setAge(singleUserData.age);
    }
  }, [singleUserData]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('api/users');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadUsersByName = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/users/byLastName/${name}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadUsersByAge = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/users/byAge/${age}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadSingleUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/${country}/${userEmail}`);
      setSingleUserData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const createUser = async (userData) => {
    try {
      const response = await axios.post('api', userData);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`api/${country}/${userEmail}`, userData);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await axios.delete(`api/${country}/${userEmail}`);
      console.log('Data deleted successfully:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmitCreate = async () => {
    const userData = {
      primaryKey: {
        country: country,
        userEmail: userEmail,
      },
      firstName: firstName,
      lastName: lastName,
      age: age,
    };
    await createUser(userData);
  };

  const handleSubmitUpdate = async () => {
    const userData = {
      primaryKey: {
        country: country,
        userEmail: userEmail,
      },
      firstName: firstName,
      lastName: lastName,
      age: age,
    };
    await updateUser(userData);
  };

  const handleDelete = async () => {
    await deleteUser();
    setSingleUserData(undefined);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">User</h1>
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
              Country*:
            </label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
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
            <label htmlFor="firstName" className="col-sm-2 col-form-label">First Name:</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
          </div>
          <div className="form-group row m-2">
            <label htmlFor="lastName" className="col-sm-2 col-form-label">Last Name:</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="form-group row m-2">
            <label htmlFor="age" className="col-sm-2 col-form-label">Age:</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="age" value={age} onChange={(e) => setAge(e.target.value)} />
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
            {loading ? 'Loading...' : 'Fetch all Users By Lastname (Filtering allowed)'}
          </button>
          <div className="form-group w-100">
            <label htmlFor="name" className="font-weight-bold text-danger">Lastname:</label>
            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div className="w-5"></div> {/* Abstand */}
        <div className="d-flex flex-column align-items-center w-50 m-4">
          <button onClick={loadUsersByAge} disabled={loading} className="btn btn-primary mb-2 w-100">
            {loading ? 'Loading...' : 'Fetch all Users By Age (Filtering not Allowed)'}
          </button>
          <div className="form-group w-100">
            <label htmlFor="ageFilter" className="font-weight-bold text-danger">Age:</label>
            <input type="number" className="form-control" id="ageFilter" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
        </div>
      </div>
      {userData.length > 0 ? 
      <table className="table table-striped m-4">
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Age</th>
            <th scope="col" className='font-weight-bold text-danger'>Email</th>
            <th scope="col" className='font-weight-bold text-danger'>Country</th>
          </tr>
        </thead>
        <tbody>
          {userData.length > 0 ? userData.map((user) => (
            <tr key={user.primaryKey.userEmail}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.age}</td>
              <td>{user.primaryKey.userEmail}</td>
              <td>{user.primaryKey.country}</td>
            </tr>
          )) : <tr><td colSpan="5" className="text-center">No data available</td></tr>}
        </tbody>
      </table>
      : "" }
    </div>
  );

};

export default App;
