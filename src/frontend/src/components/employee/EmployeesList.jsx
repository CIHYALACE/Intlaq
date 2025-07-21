import EmployeeCard from "./EmployeeCard";

export default function EmployeesList({ employees, loading }) {
    return (
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
   );
}