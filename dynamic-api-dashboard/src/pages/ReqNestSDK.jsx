// src/reqnest-sdk.js
import axios from "axios";

export default class ReqNestSDK {
  constructor({ baseUrl, apiKey }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      withCredentials: true,
    });
  }

  schema(name) {
    return {
      create: (data) => this.client.post(`/data/${name}`, data).then(r => r.data),
      list: () => this.client.get(`/data/${name}`).then(r => r.data),
      search: (criteria) => this.client.post(`/data/${name}/search`, criteria).then(r => r.data),
      update: (data, updateAll = false, field = "id") =>
        this.client.put(`/data/${name}`, data, { params: { updateAll, field } }).then(r => r.data),
      delete: (criteria) => this.client.delete(`/data/${name}/delete`, { data: criteria }).then(r => r.data),
    };
  }
}
