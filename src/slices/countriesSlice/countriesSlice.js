import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import { ALL_COUNTRIES } from "./countriesConfig";

const initialState = {
  countries: [],
  filteredCountries: [],
  currentNameFilter: "",
  currentRegionFilter: "",
  status: "idle", // idle, loading, succeeded, failed
  error: null,
};

export const getCountries = createAsyncThunk(
  "countries/getCountries",
  async () => {
    try {
      const result = await axios.get(ALL_COUNTRIES);
      console.log(result.data);
      return result.data;
    } catch (e) {
      console.log(e.message);
      throw Error("Failed to load list of countries");
    }
  }
);

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    filterCountries: (state, action) => {
      state.currentNameFilter = action.payload;
      state.filteredCountries = state.countries.filter(country =>
        country.name.common.toLowerCase().includes(state.currentNameFilter.toLowerCase()))
    },
    filterByRegion: (state, action) => {
      state.currentRegionFilter = action.payload;
      state.filteredCountries = state.countries.filter(country =>
        country.region.includes(state.currentRegionFilter)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getCountries.pending,
      (state) => {
        state.status = "loading";
      },
      builder.addCase(
        getCountries.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.countries = action.payload;
          state.filteredCountries = action.payload;
        },
        builder.addCase(getCountries.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        })
      )
    );
  },
});

export const { filterCountries, filterByRegion } = countriesSlice.actions;

export const countriesSelector = (state) => state.countries;

export const selectedCountries = createSelector(
  countriesSelector,
  (countriesSelectorState) => {
    const { filteredCountries, countriesRegion, loading, error } =
      countriesSelectorState;
    return { filteredCountries, countriesRegion, loading, error };
  }
);

export default countriesSlice.reducer;
