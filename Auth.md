# ავტორიზაცია

ავტორიზაცია ეფუძნება მომხმარებლის როლებს და დეპარტამენტებს. მონაცემები ინახება Zustand სთორში.

### მაგალითი: უფლებების შემოწმება
```javascript
import useAuth from 'hooks/useAuth'

function Component() {
  const { can, isAdmin, isDepartmentHead } = useAuth()
  
  // როლის შემოწმება
  if (can("role:admin")) {
    // ...
  }
  
  // დეპარტამენტის შემოწმება
  if (can("department:8")) {
    // ...
  }
  
  // კომბინირებული შემოწმება
  if (can("role:admin|department:8")) { // ან ადმინის როლი ან დეპარტამენტი 8-ის წევრობა
    // ...
  }
}
```

### მაგალითი: კომპონენტის დაცვა
```javascript
<ProtectedRoute permission="role:admin|role:department_head">
  <AdminPage />
</ProtectedRoute>
```

### მაგალითი: მენიუს ელემენტის დაცვა
```javascript
{
  to: "/admin/dashboard",
  label: "ადმინ პანელი",
  show: () => can("role:admin|role:department_head")
}
```

### ხელმისაწვდომი ფუნქციები
- `can(permission)` - უფლების შემოწმება
- `isAdmin()` - ადმინის შემოწმება
- `isDepartmentHead()` - დეპარტამენტის უფროსის შემოწმება
- `isInDepartment(id)` - დეპარტამენტის წევრობის შემოწმება
- `getUserDepartment()` - მომხმარებლის დეპარტამენტის მიღება
