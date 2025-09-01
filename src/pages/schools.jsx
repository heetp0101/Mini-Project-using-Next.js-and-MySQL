import { useEffect, useState } from "react";

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchSchools = async () => {
      const res = await fetch("/api/schools", {cache:"no-store"});
      const data = await res.json();
      console.log("Fetched data:", data); // ADD THIS
      setSchools(data);
      setFilteredSchools(data);
    };
    fetchSchools();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = schools.filter(
      (school) =>
        school.name.toLowerCase().includes(value) ||
        school.city.toLowerCase().includes(value) ||
        school.state.toLowerCase().includes(value)
    );
    setFilteredSchools(filtered);
  };

  const handleSort = () => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    const sorted = [...filteredSchools].sort((a, b) => {
      if (a.name < b.name) return order === "asc" ? -1 : 1;
      if (a.name > b.name) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredSchools(sorted);
  };

//   return (
//     <div style={{ maxWidth: "900px", margin: "20px auto" }}>
//       <h1>Schools</h1>
//       <div>
//         <input
//           type="text"
//           placeholder="Search by name, city, or state"
//           value={search}
//           onChange={handleSearch}
//         />
//         <button onClick={handleSort}>
//           Sort by Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
//         </button>
//       </div>
//       <table border="1" width="100%" style={{ marginTop: "20px" }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>City</th>
//             <th>State</th>
//             <th>Contact</th>
//             <th>Email</th>
//             <th>Image</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredSchools.map((school) => (
//             <tr key={school.id}>
//               <td>{school.id}</td>
//               <td>{school.name}</td>
//               <td>{school.city}</td>
//               <td>{school.state}</td>
//               <td>{school.contact}</td>
//               <td>{school.email_id}</td>
//               <td>
//                 {school.image && (
//                   <img
//                     // src={`/uploads/${school.image}`}
//                     src={school.image}
//                     alt={school.name}
//                     width="80"
//                   />
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

return (
    <div className="container">
      <h1 className="title">Schools</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, city, or state"
          value={search}
          onChange={handleSearch}
        />
        <button onClick={handleSort}>
          Sort by Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
        </button>
      </div>
      <div className="grid">
        {filteredSchools.map((school) => (
          <div className="card" key={school.id}>
            {school.image && (
              <img
                src={school.image}
                alt={school.name}
                className="school-img"
              />
            )}
            <h2>{school.name}</h2>
            <p>{school.city}, {school.state}</p>
            <p><strong>Contact:</strong> {school.contact}</p>
            <p><strong>Email:</strong> {school.email_id}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .title {
          text-align: center;
          margin-bottom: 20px;
        }
        .controls {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        input {
          padding: 8px;
          width: 250px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 8px 12px;
          background: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .school-img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .card h2 {
          font-size: 18px;
          margin: 10px 0;
          color: #777;
        }
        .card p {
          font-size: 14px;
          margin: 5px 0;
          color: #555;
        }
      `}</style>
    </div>
  );
}
