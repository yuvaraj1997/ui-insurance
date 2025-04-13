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
  password: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .required("Email address is required")
      .email("Email address should be valid"),
    password: yup.string().required("Password is required"),
  })
  .required();

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({ resolver: yupResolver(schema) });


  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await api.login(data.email, data.password);

      if (result.success) {
        const accessToken = await api.accessToken();

        if (accessToken.success) {
          sessionStorage.setItem("accessToken", JSON.stringify(accessToken.data));
          navigate("/dashboard")
          return;
        }
      }

      //@ts-ignore
      setErrorMessage(result.error.message || "Something went wrong");
      setIsLoading(false);
    }catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegisterPage = () => {
    navigate("/auth/signup");
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
                Login
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
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  label="Password"
                  type="password"
                  margin="normal"
                  {...register("password")}
                />
                {errorMessage && <Typography sx={{ color: "red" }}>{errorMessage}</Typography>}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  type="submit"
                  loading={isLoading}
                >
                  Login
                </Button>
                <Divider sx={{ marginTop: "15px" }} />
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handleSwitchToRegisterPage}
                  disabled={isLoading}
                >
                  First time here? Register now
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Grid>
    </Grid>
  );
}
