import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useCreateEvent } from "@/hooks/eventHook";
import type { TEventCreate } from "@/apiClients/eventClient/dto";

const CreateEventPage: React.FC = () => {
  const navigator = useNavigate();
  const eventMutation = useCreateEvent();

  const [eventData, setEventData] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
  });
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEventData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number(eventData.price);
    if (!price) {
      return;
    }

    if (!startDate || !endDate) {
      return;
    }

    const newEvent: TEventCreate = {
      ...eventData,
      price,
      startDate: startDate?.toDate(),
      endDate: endDate?.toDate(),
    };

    eventMutation.mutate(newEvent, {
      onSuccess: () => {
        navigator({ to: "/events" });
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "background.default",
            py: 8,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 2,
                backgroundColor: "background.paper",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                align="center"
                fontWeight="bold"
                color="primary"
                mb={4}
              >
                Create Event
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Event Name"
                    fullWidth
                    variant="outlined"
                    value={eventData.name}
                    onChange={handleInputChange("name")}
                    required
                    autoFocus
                  />

                  <TextField
                    label="Location"
                    fullWidth
                    variant="outlined"
                    value={eventData.location}
                    onChange={handleInputChange("location")}
                    required
                  />

                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={eventData.price}
                    onChange={handleInputChange("price")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>DKK</Typography>
                        ),
                        inputProps: { min: 0, step: 0.01 },
                      },
                    }}
                  />

                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />

                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    minDate={startDate ?? undefined}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />

                  <TextField
                    label="Description (optional)"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={eventData.description}
                    onChange={handleInputChange("description")}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      mt: 2,
                    }}
                    loading={eventMutation.isPending}
                  >
                    Create Event
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Container>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateEventPage;

export const Route = createFileRoute("/(app)/events/create")({
  component: CreateEventPage,
});
