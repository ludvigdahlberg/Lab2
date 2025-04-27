// client/src/components/AssignmentTable.jsx
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
    const interval = setInterval(fetchAssignments, 60000); 
    return () => clearInterval(interval); 
  }, []);

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...assignments].sort((a, b) => {
      // handles nested fields like "employee_id.employee_id"
      const aVal = field.split('.').reduce((o, k) => o?.[k], a);
      const bVal = field.split('.').reduce((o, k) => o?.[k], b);
      if (aVal < bVal) return newDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setAssignments(sorted);
  };

  return (
    <div>
      <h2>Project Assignments</h2>
      <table 
         border={1}
         cellPadding={8}
        cellSpacing={0}
        style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left'
     }}
   >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2',cursor: 'pointer'}}>
            <th onClick={() => handleSort('employee_id.employee_id')}>Employee ID</th>
            <th onClick={() => handleSort('employee_id.full_name')}>Employee Name</th>
            <th onClick={() => handleSort('project_code.project_name')}>Project Name</th>
            <th onClick={() => handleSort('start_date')}>Start Date</th>
          </tr>
        </thead>
        <tbody style={{ border: '1px solid black'}}>
          {assignments.map((assign) => (
            <tr key={assign._id} style={{ border: '1px solid black'}}>
              <td>{assign.employee_id?.employee_id}</td>
              <td>{assign.employee_id?.full_name}</td>
              <td>{assign.project_code?.project_name}</td>
              <td>{new Date(assign.start_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
