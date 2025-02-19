# API კომუნიკაცია

API კომუნიკაცია ხორციელდება ორ დონეზე:
1. `services` - Axios-ზე დაფუძნებული სერვისები
2. `queries` - TanStack Query-ს ქეშირების და მუტაციების ვრაპერები

### Axios კონფიგურაცია
```javascript
// src/plugins/axios.js
const defaultInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true
})

// ტოკენის ავტომატური დამატება
defaultInstance.interceptors.request.use(config => {
  const token = sessionStorage.getItem("token")
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})
```

### სერვისის მაგალითი
```javascript
// src/services/chatroom.js
import axios from "../plugins/axios"

const ChatRoomService = {
  getChatRooms: () => axios.get("/api/chat-rooms"),
  getMessages: (roomId) => axios.get(`/api/chat-rooms/${roomId}/messages`),
  sendMessage: (roomId, data) => axios.post(`/api/chat-rooms/${roomId}/messages`, data)
}
```

### Query-ს მაგალითი
```javascript
// src/queries/admin.js
import { useQuery } from "@tanstack/react-query"
import AdminService from "../services/admin"

export const useGetDepartments = (options = {}) => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => AdminService.getDepartments(),
    select: (response) => response.data,
    ...options
  })
}
```

### გამოყენების მაგალითი
```javascript
function Component() {
  const { data: departments, isLoading } = useGetDepartments()
  
  if (isLoading) return "იტვირთება..."
  
  return departments.map(dept => (
    <div key={dept.id}>{dept.name}</div>
  ))
}
