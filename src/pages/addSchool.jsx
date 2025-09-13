// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { useRouter } from "next/router";

// export default function AddSchool() {
  
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");



//   const onSubmit = async (data) => {
//     setLoading(true);
//     setMessage("");

//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("address", data.address);
//     formData.append("city", data.city);
//     formData.append("state", data.state);
//     formData.append("contact", data.contact);
//     formData.append("email_id", data.email_id);
//     formData.append("image", data.image[0]);

//     try {
//       const res = await fetch("/api/addSchool", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();
//       if (res.ok) {
//         setMessage("✅ School added successfully!");
//         reset();
//         router.push("/schools");
//       } else {
//         setMessage(result.error || "❌ Error adding school");
//       }
//     } catch (error) {
//       setMessage("❌ Something went wrong");
//     }

//     setLoading(false);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "600px",
//         margin: "40px auto",
//         padding: "30px",
//         backgroundColor: "#fff",
//         borderRadius: "12px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
//         Add School
//       </h1>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         encType="multipart/form-data"
//         style={{ display: "flex", flexDirection: "column", gap: "15px" }}
//       >
//         {/** Form Fields */}
//         {[
//           { label: "School Name", name: "name", type: "text" },
//           { label: "Address", name: "address", type: "text" },
//           { label: "City", name: "city", type: "text" },
//           { label: "State", name: "state", type: "text" },
//           { label: "Contact", name: "contact", type: "number" },
//           { label: "Email", name: "email_id", type: "email" },
//         ].map((field) => (
//           <div key={field.name} style={{ display: "flex", flexDirection: "column" }}>
//             <label
//               style={{ fontWeight: "bold", marginBottom: "5px", color: "#444" }}
//             >
//               {field.label}
//             </label>
//             <input
//               type={field.type}
//               {...register(field.name, { required: true })}
//               style={{
//                 padding: "10px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 fontSize: "16px",
//               }}
//             />
//             {errors[field.name] && (
//               <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>
//                 {field.label} is required
//               </p>
//             )}
//           </div>
//         ))}

//         {/** Image Upload */}
//         <div style={{ display: "flex", flexDirection: "column" }}>
//           <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#444" }}>
//             Upload Image
//           </label>
//           <input
//             type="file"
//             {...register("image", { required: true })}
//             style={{
//               padding: "8px",
//               borderRadius: "6px",
//               border: "1px solid #ccc",
//               backgroundColor: "#fafafa",
//             }}
//           />
//           {errors.image && (
//             <p style={{ color: "red", fontSize: "14px", marginTop: "3px" }}>
//               Image is required
//             </p>
//           )}
//         </div>

//         {/** Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             backgroundColor: loading ? "#888" : "#4CAF50",
//             color: "#fff",
//             padding: "12px",
//             fontSize: "16px",
//             fontWeight: "bold",
//             border: "none",
//             borderRadius: "8px",
//             cursor: loading ? "not-allowed" : "pointer",
//             transition: "background 0.3s ease",
//           }}
//         >
//           {loading ? "Submitting..." : "Add School"}
//         </button>
//       </form>

//       {/** Message */}
//       {message && (
//         <p
//           style={{
//             textAlign: "center",
//             marginTop: "15px",
//             color: message.includes("✅") ? "green" : "red",
//             fontWeight: "bold",
//           }}
//         >
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }



import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AddSchool() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" }); // validate on blur
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Protect route: check session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/checkSession", {
          credentials:"include",
        });
        if (!res.ok) {
          router.push(`/login?redirect=/addSchool`);
        }
      } catch {
        router.push(`/login?redirect=/addSchool`);
      }
    }
    checkAuth();
  }, [router]);



  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("contact", data.contact);
    formData.append("email_id", data.email_id);
    formData.append("image", data.image[0]);

    try {
      const res = await fetch("/api/addSchool", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ School added successfully!");
        reset();
        router.push("/schools");
      } else {
        setMessage(result.error || "❌ Error adding school");
      }
    } catch (error) {
      setMessage("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Add School
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/** Form Fields with Validations */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", color:"#333" }}>School Name</label>
          <input
            type="text"
            {...register("name", {
              required: "School name is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters and spaces allowed",
              },
            })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", color:"#333" }}>Address</label>
          <input
            type="text"
            {...register("address", {
              required: "Address is required",
              minLength: { value: 5, message: "Minimum 5 characters" },
            })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.address && <p style={{ color: "red" }}>{errors.address.message}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", color:"#333" }}>City</label>
          <input
            type="text"
            {...register("city", {
              required: "City is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters and spaces allowed",
              },
            })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.city && <p style={{ color: "red" }}>{errors.city.message}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", color:"#333" }}>State</label>
          <input
            type="text"
            {...register("state", {
              required: "State is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters and spaces allowed",
              },
            })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.state && <p style={{ color: "red" }}>{errors.state.message}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", color:"#333" }}>Contact</label>
          <input
            type="number"
            {...register("contact", {
              required: "Contact number is required",
              pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
            })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.contact && <p style={{ color: "red" }}>{errors.contact.message}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", color:"#333" }}>Email</label>
          <input
            type="email"
            {...register("email_id", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.email_id && <p style={{ color: "red" }}>{errors.email_id.message}</p>}
        </div>

        {/** Image Upload with validation */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", color:"#333" }}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", {
              required: "Image is required",
              validate: (files) =>
                files[0]?.size <= 2 * 1024 * 1024 || "Image must be less than 2MB",
            })}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#fafafa",
            }}
          />
          {errors.image && <p style={{ color: "red" }}>{errors.image.message}</p>}
        </div>

        {/** Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#888" : "#4CAF50",
            color: "#fff",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.3s ease",
          }}
        >
          {loading ? "Submitting..." : "Add School"}
        </button>
      </form>

      {/** Message */}
      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            color: message.includes("✅") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
