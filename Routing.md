# რაუთინგი

რაუთები განსაზღვრულია `src/routes/index.js` ფაილში. თითოეული რაუთი გატარებულია `ProtectedRoute` კომპონენტში, რომელიც ამოწმებს მომხმარებლის უფლებებს.

### მაგალითი
```javascript
// მარტივი რაუთი
{
  path: "/dashboard",
  component: withProtectedRoute(<Dashboard />)
}

// უფლებებით დაცული რაუთი
{
  path: "/admin/dashboard",
  component: withProtectedRoute(
    <AdminPage />,
    "role:admin|role:department_head|department:8"
  )
}

// ჩაშლილი რაუთები
{
  path: "/applications",
  children: {
    vacation: {
      path: "/applications/vacation",
      children: {
        new: {
          path: "/applications/vacation/new",
          component: withProtectedRoute(<VacationPage />)
        },
        approve: {
          path: "/applications/vacation/approve",
          component: withProtectedRoute(
            <VacationPageApprove />,
            "role:admin|role:department_head"
          )
        }
      }
    }
  }
}
```

### უფლებების ფორმატი
- `role:admin` - ადმინის როლი
- `department:8` - კონკრეტული დეპარტამენტი აიდის მიხედვით
- `user:155` - კონკრეტული მომხმარებელი
- `|` - OR ოპერატორი (ან ერთი ან მეორე)
- `,` - AND ოპერატორი (ორივე)
