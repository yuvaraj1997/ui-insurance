import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../utils/api";

interface IFormInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const passwordRules =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!&])[A-Za-z\d@$!&]{8,64}$/;

const schema = yup
  .object({
    email: yup
      .string()
      .required("Email address is required")
      .email("Email address should be valid"),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be between 8 and 64 characters")
      .max(64, "Password must be between 8 and 64 characters")
      .matches(
        passwordRules,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one of these special characters: @, $, !, &"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf(
        [yup.ref("password")],
        "Confirm Password must match with password"
      ),
  })
  .required();

export default function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({ resolver: yupResolver(schema) });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsSubmitting(true);
    console.log(data);

    try {
      const result = await api.signup(data);

      if (!result.success) {
        setSignUpErrorMessage(
          result.error.message ?? "Someting went wrong plese try again later."
        );
        return;
      }

      navigate("/auth/login");
    } catch (err) {
      setSignUpErrorMessage("Someting went wrong plese try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToLoginPage = () => {
    navigate("/auth/login");
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={(theme) => ({ height: "100vh", bgcolor: theme.palette.grey[300] })}
    >
      <Grid>
        <Container maxWidth="xs">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sign Up
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  label="Email"
                  margin="normal"
                  {...register("email")}
                />
                <TextField
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  label="First Name"
                  margin="normal"
                  {...register("firstName")}
                />
                <TextField
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  label="Last Name"
                  margin="normal"
                  {...register("lastName")}
                />
                <TextField
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message ?? "Password must contain at least one uppercase letter, one lowercase letter, one number, and one of these special characters: @, $, !, &"}
                  label="Password"
                  type="password"
                  margin="normal"
                  {...register("password")}
                />
                <TextField
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  label="Confirm Password"
                  type="password"
                  margin="normal"
                  {...register("confirmPassword")}
                />
                {signUpErrorMessage && (
                  <Typography color="red">{signUpErrorMessage}</Typography>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  type="submit"
                  loading={isSubmitting}
                >
                  Sign Up
                </Button>
                <Divider sx={{ marginTop: "15px" }} />
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handleSwitchToLoginPage}
                  disabled={isSubmitting}
                >
                  Back to login
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Grid>
    </Grid>
  );
}
