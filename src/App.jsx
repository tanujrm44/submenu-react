import React, { useState } from "react"
import "./index.css"
import initialMenuData from "./data/menuData.json"

function App() {
  const [menuData, setMenuData] = useState(initialMenuData)

  const updateNestedMenu = (data, indices, callback) => {
    if (indices.length === 0) return callback(data)
    const [currentIndex, ...rest] = indices
    return data.map((item, index) => {
      if (index === currentIndex) {
        return {
          ...item,
          children: updateNestedMenu(item.children || [], rest, callback),
        }
      }
      return item
    })
  }

  const toggleSubMenu = (e) => {
    e.stopPropagation()
    let children = e.target.querySelector("ul")
    if (!children) return

    if (children.style.display === "none" || !children.style.display) {
      children.style.display = "block"
    } else {
      children.style.display = "none"
    }
  }

  const addMenuItem = () => {
    const newItem = { label: `Menu ${menuData.length + 1}` }
    setMenuData([...menuData, newItem])
  }

  const removeMenuItem = (indices) => {
    setMenuData((prevMenu) =>
      updateNestedMenu(prevMenu, indices.slice(0, -1), (submenu) =>
        submenu.filter((_, i) => i !== indices[indices.length - 1])
      )
    )
  }

  const handleAddSubMenu = (indices) => {
    const newSubMenuLabel = prompt("Enter submenu label")
    if (!newSubMenuLabel) return

    setMenuData((prevMenu) =>
      updateNestedMenu(prevMenu, indices, (submenu) => [
        ...submenu,
        { label: newSubMenuLabel },
      ])
    )
  }

  const renderSubMenu = (subMenu, indices = []) => (
    <ul className="submenu">
      {subMenu.map((item, index) => {
        const currentIndices = [...indices, index]
        return (
          <li key={index} onClick={toggleSubMenu}>
            {item.label}
            {item.children && renderSubMenu(item.children, currentIndices)}
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeMenuItem(currentIndices)
              }}
            >
              Remove
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddSubMenu(currentIndices)
              }}
            >
              Add
            </button>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div>
      <button onClick={addMenuItem}>Add Menu Item</button>
      <ul>
        {menuData.map((item, index) => (
          <li key={index} onClick={toggleSubMenu}>
            {item.label}
            {item.children && renderSubMenu(item.children, [index])}
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeMenuItem([index])
              }}
            >
              Remove
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddSubMenu([index])
              }}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
