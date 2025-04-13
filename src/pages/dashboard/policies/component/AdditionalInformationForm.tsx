import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface AdditionalInfoFormProps {
  insuranceType: "auto" | "home" | "life";
  onSubmit: (data: any) => void;
}

const autoSchema = yup.object({
  type: yup.string().oneOf(["car", "motor"]).required("Type is required"),
  additionalDriver: yup.boolean(),
  naturalDisaster: yup.boolean(),
});

const homeSchema = yup.object({
  type: yup
    .string()
    .oneOf(["Apartment", "Landed"])
    .required("Type is required"),
  numberOfRooms: yup
    .number()
    .min(1, "Must be at least 1 room")
    .required("Number of rooms is required"),
});

const lifeSchema = yup.object({
  age: yup
    .number()
    .min(18, "Age must be atleast 18")
    .required("Age is required"),
  healthStatus: yup
    .string()
    .oneOf(["Excellent", "Good", "Poor"])
    .required("Health status is required"),
});

export default function AdditionalInformationForm({
  insuranceType,
  onSubmit,
}: AdditionalInfoFormProps) {
  const schema =
    insuranceType === "auto"
      ? autoSchema
      : insuranceType === "home"
      ? homeSchema
      : lifeSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    //@ts-ignore
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {insuranceType === "auto" && (
        <>
          <TextField
            fullWidth
            select
            label="Type"
            margin="normal"
            {...register("type")}
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            <MenuItem value="car">Car</MenuItem>
            <MenuItem value="motor">Motor</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Controller
                name="additionalDriver"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value ?? false} />
                )}
              />
            }
            label="Include Additional Driver"
          />

          <FormControlLabel
            control={
              <Controller
                name="naturalDisaster"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value ?? false} />
                )}
              />
            }
            label="Natural Disaster Coverage"
          />
        </>
      )}

      {insuranceType === "home" && (
        <>
          <TextField
            fullWidth
            select
            label="Type"
            margin="normal"
            {...register("type")}
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            <MenuItem value="Apartment">Apartment</MenuItem>
            <MenuItem value="Landed">Landed</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Number of Rooms"
            margin="normal"
            //@ts-ignore
            {...register("numberOfRooms")}
            //@ts-ignore
            error={!!errors.numberOfRooms}
            //@ts-ignore
            helperText={errors.numberOfRooms?.message}
          />
        </>
      )}

      {insuranceType === "life" && (
        <>
          <TextField
            fullWidth
            type="number"
            label="Age"
            margin="normal"
            //@ts-ignore
            {...register("age")}
            //@ts-ignore
            error={!!errors.age}
            //@ts-ignore
            helperText={errors.age?.message}
          />

          
          <TextField
            fullWidth
            select
            label="Health Status"
            margin="normal"
            //@ts-ignore
            {...register("healthStatus")}
            //@ts-ignore
            error={!!errors.healthStatus}
            //@ts-ignore
            helperText={errors.healthStatus?.message}
          >
            <MenuItem value="Excellent">Excellent</MenuItem>
            <MenuItem value="Good">Good</MenuItem>
            <MenuItem value="Poor">Poor</MenuItem>
          </TextField>
        </>
      )}

      <Grid sx={{ mt: 2, justifyContent: "end" }} container>
        <Grid>
          <Button variant="contained" type="submit">
            Continue
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
