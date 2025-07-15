import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEmployees } from '../db/api';
import EmployeeCard from '../components/employee/EmployeeCard';

const EmployeesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    skills: searchParams.get('skills') || '',
    experience: searchParams.get('exp') || '',
    location: searchParams.get('location') || '',
  });

  // Fetch employees when component mounts or filters change
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        console.log('Fetching employees with filters:', filters);
        const response = await getEmployees(filters);
        console.log('Employees API response:', response);
        const employeesData = response.data || [];
        console.log('Employees data:', employeesData);
        console.log('First employee:', employeesData[0]);
        console.log('First employee structure:', JSON.stringify(employeesData[0], null, 2));
        console.log('First employee user:', employeesData[0]?.user);
        console.log('First employee user type:', typeof employeesData[0]?.user);
        console.log('First employee user properties:', Object.keys(employeesData[0]?.user || {}));
        console.log('First employee user value:', employeesData[0]?.user);
        
        // Check if user is an object
        if (typeof employeesData[0]?.user === 'object') {
          console.log('User object properties:', Object.keys(employeesData[0].user));
          console.log('User object values:', Object.values(employeesData[0].user));
        }
        
        // Try different access methods
        console.log('User as string:', String(employeesData[0]?.user));
        console.log('User toString:', employeesData[0]?.user?.toString());
        console.log('User valueOf:', employeesData[0]?.user?.valueOf());
        console.log('User JSON:', JSON.stringify(employeesData[0]?.user));
        
        setEmployees(employeesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will trigger with the updated filters
  };

  // Sample skills for the filter dropdown
  const skillsList = [
    'React', 'JavaScript', 'Python', 'Django', 'Node.js', 
    'UI/UX', 'GraphQL', 'SQL', 'AWS', 'Docker'
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Filter Employees</h5>
              
              <form onSubmit={handleSearch}>
                <div className="mb-3">
                  <label htmlFor="search" className="form-label">Search by name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Name or keywords..."
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City or country"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="skills" className="form-label">Skills</label>
                  <select
                    className="form-select"
                    id="skills"
                    name="skills"
                    value={filters.skills}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Skills</option>
                    {skillsList.map(skill => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="experience" className="form-label">Experience Level</label>
                  <select
                    className="form-select"
                    id="experience"
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Experience</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Apply Filters
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setFilters({
                      search: '',
                      skills: '',
                      experience: '',
                      location: '',
                    });
                    setSearchParams({});
                  }}
                >
                  Clear All
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Employees List */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Find Talent</h2>
            <div>
              <span className="text-muted me-2">Sort by:</span>
              <select className="form-select d-inline-block w-auto">
                <option>Most Relevant</option>
                <option>Most Experience</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading employees...</p>
            </div>
          ) : employees.length > 0 ? (
            <div className="row g-4">
              {employees.map((employee) => (
                <div key={employee.id} className="col-md-6 col-lg-4">
                  <EmployeeCard employee={employee} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-users fa-4x text-muted mb-3"></i>
              <h4>No employees found</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          {employees.length > 0 && (
            <nav aria-label="Employees pagination" className="mt-4">
              <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                  <button className="page-link" disabled>Previous</button>
                </li>
                <li className="page-item active"><span className="page-link">1</span></li>
                <li className="page-item"><button className="page-link">2</button></li>
                <li className="page-item"><button className="page-link">3</button></li>
                <li className="page-item">
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
