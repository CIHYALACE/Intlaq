import { useState, useEffect } from "react";
import { getEmployees, getEmployers, getJobs, getApplications } from "../db/api";

export default function HomePage() {
    const [employees, setEmployees] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees();
                setEmployees(response.data);
                console.log('Employees:', response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    // Fetch employers
    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                const response = await getEmployers();
                setEmployers(response.data);
                console.log('Employers:', response.data);
            } catch (error) {
                console.error('Error fetching employers:', error);
            }
        };
        fetchEmployers();
    }, []);

    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobs();
                setJobs(response.data);
                console.log('Jobs:', response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchJobs();
    }, []);

    // Fetch applications
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplications();
                setApplications(response.data);
                console.log('Applications:', response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchApplications();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
}