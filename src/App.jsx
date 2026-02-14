import React from "react";
import { useState, useEffect } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
function App() {
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const updatedUsers = JSON.parse(localStorage.getItem("Values:") || "[]");
    setAllUsers(updatedUsers);
    console.log(updatedUsers);
  }, []);
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be atleast 3 characters long .")
      .required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .matches(
        passwordRegex,
        "Password must contain Minimum 8 characters, At least 1 uppercase letter, At least 1 lowercase letter, At least 1 number, At least 1 special character",
      )
      .required("Password is required"),
    cPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password does not match")
      .required("Confirm is required"),
  });
  const initialValues = {
    name: "",
    email: "",
    password: "",
    cPassword: "",
  };
  const handleDelete = (id) => {
    const newUsers = allUsers.filter((user) => user.id !== id);
    setAllUsers(newUsers);
    localStorage.setItem("Values:", JSON.stringify(newUsers));
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          const users = {
            id: Date.now(),
            name: values.name,
            email: values.email,
          };
          const existingUsers = JSON.parse(
            localStorage.getItem("Values:") || "[]",
          );

          existingUsers.push(users);
          localStorage.setItem("Values:", JSON.stringify(existingUsers));
          setAllUsers(existingUsers);
          resetForm();
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <Field
              name="name"
              placeholder="Enter Your Name"
              type="text"
              values={values.name}
              onChange={handleChange}
            />
            <ErrorMessage name="name" component="div" className="text-danger" />
            <Field
              name="email"
              placeholder="Enter Your Email"
              type="email"
              values={values.email}
              onChange={handleChange}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-danger"
            />
            <Field
              name="password"
              placeholder="Enter Your Password"
              type="text"
              values={values.password}
              onChange={handleChange}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-danger"
            />
            <Field
              name="cPassword"
              placeholder="Enter Your Confirm Passowrd"
              type="text"
              values={values.cPassword}
              onChange={handleChange}
            />
            <ErrorMessage
              name="cPassword"
              component="div"
              className="text-danger"
            />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      <table cellPadding={10} border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => {
                      handleDelete(user.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default App;
