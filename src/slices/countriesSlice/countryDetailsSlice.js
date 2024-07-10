import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import { searchByCountry, filterByCode } from "./countriesConfig";

const initialState = {
  country: [],
  status: "idle", // idle, loading, succeeded, failed
  error: null,
};

export const getCountryDetails = createAsyncThunk(
  "countryDetails/getCountryDetails",
  async (name) => {
    try {
      const result = await axios.get(searchByCountry(name));
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error.message);
      throw Error("Failed to load country details");
    }
  }
);

export const getBorderCountryDetails = createAsyncThunk(
  "countryDetails/getBorderCountryDetails",
  async (code) => {
    try {
        const result = await axios.get(filterByCode(code));
        console.log(result.data);
        return result.data;
    } catch (error) {
      console.log(error.message);
      throw Error("Failed to load country details");
    }
  }
);

const countryDetailsSlice = createSlice({
  name: "countryDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getCountryDetails.pending,
      (state) => {
        state.status = "loading";
      },
      builder.addCase(
        getCountryDetails.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.country = action.payload;
        },
        builder.addCase(getCountryDetails.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }),
        builder.addCase(getBorderCountryDetails.fulfilled, (state, action) => {
          state.country = action.payload;
        })
      )
    );
  },
});

const countryDetailsSelector = (state) => state.countryDetails;

export const selectedCountryDetails = createSelector(
  countryDetailsSelector,
  (selectedCountryDetalsState) => {
    const { country, error } = selectedCountryDetalsState;
    return { country, error };
  }
);

export default countryDetailsSlice.reducer;
