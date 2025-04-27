import { useState, useEffect } from 'react';

export default function AssignmentTable() {
  const [assignments, setAssignments] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch data function
  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/projectassignments');
      const data = await response.json();
      // Sort by most recent (latest) 
      const sorted = data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      setAssignments(sorted.slice(0, 5)); // latest 5
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    const interval = setInterval(fetchAssignments, 6000); // Refresh every minute
    return () => clearInterval(interval); 
  }, []);

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...assignments].sort((a, b) => {
      if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setAssignments(sorted);
  };

  return (
    <div>
      <h2>Project Assignments</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('employee.employee_id')}>Employee ID</th>
            <th onClick={() => handleSort('employee.full_name')}>Employee Name</th>
            <th onClick={() => handleSort('project.project_name')}>Project Name</th>
            <th onClick={() => handleSort('start_date')}>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assign) => (
            <tr key={assign._id}>
              <td>{assign.employee?.employee_id}</td>
              <td>{assign.employee?.full_name}</td>
              <td>{assign.project?.project_name}</td>
              <td>{new Date(assign.start_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
