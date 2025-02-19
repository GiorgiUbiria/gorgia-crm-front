# ლეიაუთის სტრუქტურა

აპლიკაციის ლეიაუთი შედგება შემდეგი კომპონენტებისგან:

### მთავარი სტრუქტურა (src/components/VerticalLayout/index.js)
```javascript
<div className="min-h-screen flex flex-col">
  <Header />
  <Sidebar />
  <div className="flex-1">
    <main>{children}</main>
    <Footer />
  </div>
</div>
```

### მენიუს კონფიგურაცია (menuConfig.js)
```javascript
// მარტივი მენიუს ელემენტი
{
  to: "/dashboard",
  icon: LuHouse,
  label: "მთავარი გვერდი"
}

// ქვემენიუთი
{
  key: "admin",
  icon: BsGear,
  label: "სამართავი პანელი",
  submenu: [
    {
      to: "/admin/dashboard",
      label: "მთავარი",
      show: () => can("role:admin")
    }
  ]
}
```

### მენიუს ელემენტის კომპონენტი (MenuItem.js)
```javascript
<MenuItem
  to="/dashboard"
  icon={LuHouse}
  label="მთავარი გვერდი"
  hasSubmenu={false}
  isActive={true}
/>
```

### მენიუს უფლებები
მენიუს ელემენტები იფილტრება მომხმარებლის უფლებების მიხედვით:
```javascript
const filterMenuItems = items => {
  return items
    .map(item => {
      if (item.show && !item.show()) {
        return null
      }
      // ...
    })
    .filter(Boolean)
}
```
