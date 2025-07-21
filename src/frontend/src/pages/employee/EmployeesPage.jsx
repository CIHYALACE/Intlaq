import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEmployees } from '../../db/api';
import EmployeesList from '../../components/employee/EmployeesList';
import EmployerAccess from '../../components/employee/EmployerAccess';
import { getCurrentUser } from '../../utils/auth';

const EmployeesPage = () => {
  const currentUser = getCurrentUser();
  const is_employer = currentUser ? currentUser.isEmployer : false;
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
        const response = await getEmployees(filters);
        const employeesData = response.data || []; 

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
        {is_employer && <div className="col-lg-3 mb-4">
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
        </div>}

        {/* Employees List */}
        {is_employer ? <EmployeesList employees={employees} loading={loading} /> : <EmployerAccess />}
      </div>
    </div>
  );
};

export default EmployeesPage;
