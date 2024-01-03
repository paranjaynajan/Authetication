import { React, useEffect, useReducer, useState, useContext } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Container,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import Error from "../error/error";
import Home from "../homepage/home";
import ErrorBoundary from "../error/error";
import AuthContext from "../../utils/provider";
import { Navigate } from "react-router-dom";
import { createWorker } from 'tesseract.js';
import Tesseract from "tesseract.js";


export default function Login() {
  const { auth, setAuth } = useContext(AuthContext);

  const [recognizedText, setRecognizedText] = useState('');

  const nav = useNavigate();
  const { TesseractWorker } = Tesseract;
  const worker = new TesseractWorker();
  
   
  const BoxStyling = {
    display: "flex",
    justifyContent: "center",
  };

  const LoginSchema = Yup.object().shape({
    phone: Yup.string()
    .required("Enter a valid phone address"),
    password: Yup.string().required("Enter Valid password"),
  });

  const handleLoginButton = async (values) => {
    console.log(values);
    const response = await axios.post(
      "http://localhost:5000/api/auth/signin",
      values
    );
    console.log(response.data);
   localStorage.setItem("auth",response.data.token);
    setAuth(response.data.token)
    nav("/home");
  };
useEffect(()=>{

},[])
const handleImageUpload = (event) => {
  const imageFile = event.target.files[0]
  if (imageFile) {
    
    worker.recognize(imageFile)
      .then((result) => {
        setRecognizedText(result.data.text);
      })
      .catch((error) => {
        console.error('OCR Error:', error);
      })
      .finally(() => {
        worker.terminate(); 
      });
  }

};
  return (
    <>
      <div>
        <Box className="form_Data_Container">
          <Box sx={{ width: 800 }}>
            <Formik
              initialValues={{
                phone: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              validateOnChange={true}
              validateOnBlur={false}
              handleChange={() => {}}
              onSubmit={(values) => {
                handleLoginButton(values);
              }}
            >
              {({
                errors,
                values,
                touched,
                handleChange,
                validateField,
                validateForm,
              }) => (
                <Form>
                  <Box>
                    <Box className="secound_Container_Form">
                      <Box>
                        <Typography
                          variant="h4"
                          className="font_Headline_Welcome"
                        >
                          Welcome Back
                        </Typography>
                      </Box>
                      <Grid container rowSpacing={1} sx={{ px: 8 }}>
                        <Grid item xs={12} sm={12} md={12}>
                          <Typography
                            variant="h6"
                            className="all_Lable_In_Components"
                          >
                            Email
                          </Typography>
                          <TextField
                            type="text"
                            name="phone"
                            value={values.phone}
                            helperText={
                              touched.phone ? errors.phone : undefined
                            }
                            error={touched.phone ? errors.phone : undefined}
                            touched={touched.phone}
                            sx={BoxStyling}
                            InputProps={{
                              sx: {
                                borderRadius: "10px",
                                fontFamily: "Inter !important",
                              },
                            }}
                            onChange={handleChange("phone")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                          <Box>
                            <Typography
                              variant="h6"
                              className="all_Lable_In_Components"
                            >
                              Password
                            </Typography>
                            <FormControl fullWidth>
                              <TextField
                                type="text "
                                name="password"
                                sx={BoxStyling}
                                helperText={
                                  touched.password ? errors.password : undefined
                                }
                                error={
                                  touched.password ? errors.password : undefined
                                }
                                touched={touched.password}
                                value={values.password}
                                onChange={handleChange("password")}
                                InputProps={{
                                  sx: {
                                    borderRadius: "10px",
                                    fontFamily: "Inter !important",
                                  },

                                  endAdornment: (
                                    <InputAdornment position="end"></InputAdornment>
                                  ),
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} sx={{ pb: 3 }}>
                          <Button
                            variant="contained"
                            type="submit"
                            className="Long_Buttons_Forms"
                          >
                            Login
                          </Button>
                        </Grid>
                      </Grid>
                    
                     
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
    <input type="file" onChange={handleImageUpload}/>
    {recognizedText}
      </div>
    </>
  );
}
