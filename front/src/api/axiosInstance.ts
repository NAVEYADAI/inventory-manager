import axios from "axios";
import { allEnv } from "../env";

const baseURL = allEnv("back");
const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
