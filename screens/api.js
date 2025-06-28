import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://getbizlinker.site";

const apiClient = axios.create({ baseURL: BASE_URL });
export async function getAllMessages(userID) {
  const res = await fetch(`${BASE_URL}/getMessages.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID }),
  });
  return res.json();
}
/* attach token */
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ───── Reports ───── */
export const fetchReports = () => apiClient.get("/reports");

// FIXED: Now matches website backend, sends to PHP endpoint
export const createReport = (payload) =>
  axios.post(`${BASE_URL}/backend/submitReport.php`, payload, {
    headers: { "Content-Type": "application/json" },
  });

export const updateReportStatus = (id, status) =>
  apiClient.patch(`/reports/${id}`, { status });

/* ───── Profile ───── */
export const getUserProfile = () => apiClient.get("/me").then((r) => r.data);
export const updateUserProfile = (d) =>
  apiClient.put("/profile", d).then((r) => r.data);
export const changePassword = (d) =>
  apiClient.post("/change-password", d).then((r) => r.data);

export const uploadProfilePicture = async (uri) => {
  const form = new FormData();
  form.append("profilePicture", {
    uri,
    type: "image/jpeg",
    name: "avatar.jpg",
  });
  const res = await apiClient.post("/upload-avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAccount = () =>
  apiClient.delete("/delete-account").then((r) => r.data);

/* ───── Auth ───── */
export const registerUser = (d) => axios.post(`${BASE_URL}/auth/register`, d);
export const loginUser = (c) => axios.post(`${BASE_URL}/auth/login`, c);
export const logoutUser = () => axios.post(`${BASE_URL}/auth/logout`);

/* ───── Public data ───── */
export const fetchEvents = () => axios.get(`${BASE_URL}/events`);
export const fetchPromotedBusinesses = () =>
  axios
    .get("https://getbizlinker.site/backend/getAllBusinesses.php")
    .then((r) => (r.data.success ? r.data.businesses : []));

export const fetchServiceReviews = (id) =>
  axios.get(`${BASE_URL}/services/${id}/reviews`);
export const fetchEventReviews = (id) =>
  axios.get(`${BASE_URL}/events/${id}/reviews`);
export const fetchBusinessReviews = async (businessID) => {
  const res = await fetch(`${BASE_URL}/backend/getReviews.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: businessID,
      reviewType: "business",
    }),
  });

  const data = await res.json();
  return { data: data || [] };
};

export const fetchServiceInfo = async (serviceID) => {
  const res = await fetch(
    `${BASE_URL}/backend/getServiceById.php?id=${serviceID}`
  );
  const data = await res.json();
  return data.success ? data.service : null;
};

export const fetchBusinessInfo = async (businessID) => {
  const res = await fetch(
    `${BASE_URL}/backend/businessInfo.php?businessID=${businessID}`
  );
  const data = await res.json();
  return data;
};
export const fetchServiceSummary = (id) =>
  apiClient.get(`/service/${id}/summary`);
export const fetchAllReviews = (type, id) =>
  axios.get(`${BASE_URL}/${type}/${id}/all-reviews`).then((r) => r.data);

export const fetchApprovedServices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/backend/getServices.php`);
    const result = await response.json();

    if (result?.success === true && Array.isArray(result.services)) {
      return result.services;
    } else {
      throw new Error("Service response not in expected format");
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

/* ───── Chat ───── */
export const sendChatMessage = (message) =>
  apiClient.post("/chatbot", { message }).then((r) => r.data.reply);

/* ───── Business application ───── */
export const submitBusinessApplication = (form) =>
  apiClient
    .post("/business-application", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
