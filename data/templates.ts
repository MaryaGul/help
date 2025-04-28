import type { Template } from "@/types"
import { v4 as uuidv4 } from "uuid"

export const EMPTY_TEMPLATE_900x900: Template = {
  id: "empty-900x900",
  name: "Пустой шаблон (900x900)",
  width: 900,
  height: 900,
  backgroundColor: "#ffffff",
  elements: [],
}

export const EMPTY_TEMPLATE_900x1200: Template = {
  id: "empty-900x1200",
  name: "Пустой шаблон (900x1200)",
  width: 900,
  height: 1200,
  backgroundColor: "#ffffff",
  elements: [],
}

export const SMARTWATCH_TEMPLATE: Template = {
  id: "smartwatch-template",
  name: "Смарт-часы",
  width: 900,
  height: 1200,
  backgroundColor: "#ffffff",
  backgroundImage: "/backgrounds/gradient-purple.jpg",
  elements: [
    {
      id: uuidv4(),
      type: "text",
      content: "СМАРТ-ЧАСЫ",
      x: 50,
      y: 120,
      fontSize: 80,
      fontFamily: "Inter",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#e91e63",
      textAlign: "left",
      width: 800,
    },
    {
      id: uuidv4(),
      type: "text",
      content: "2-й ремешок в подарок",
      x: 50,
      y: 250,
      fontSize: 48,
      fontFamily: "Inter",
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#000000",
      textAlign: "left",
      width: 800,
    },
    {
      id: uuidv4(),
      type: "image",
      src: "/products/smartwatch.png",
      x: 500,
      y: 400,
      width: 400,
      height: 400,
    },
    {
      id: uuidv4(),
      type: "list",
      items: [
        {
          id: uuidv4(),
          content: "Связь",
          icon: "phone",
        },
        {
          id: uuidv4(),
          content: "Музыка",
          icon: "music",
        },
        {
          id: uuidv4(),
          content: "Здоровье и спорт",
          icon: "heart-pulse",
        },
        {
          id: uuidv4(),
          content: "Мощная батарея",
          icon: "battery-charging",
        },
        {
          id: uuidv4(),
          content: "Беспроводная зарядка",
          icon: "wifi",
        },
      ],
      x: 50,
      y: 400,
      fontSize: 24,
      fontFamily: "Inter",
      fontWeight: "medium",
      fontStyle: "normal",
      color: "#000000",
      iconColor: "#7e22ce",
      spacing: 80,
      width: 400,
    },
    {
      id: uuidv4(),
      type: "image",
      src: "/products/gift-box-1.png",
      x: 100,
      y: 900,
      width: 150,
      height: 150,
    },
    {
      id: uuidv4(),
      type: "image",
      src: "/products/gift-box-2.png",
      x: 250,
      y: 950,
      width: 120,
      height: 120,
    },
  ],
}

export const TEMPLATES = [EMPTY_TEMPLATE_900x900, EMPTY_TEMPLATE_900x1200, SMARTWATCH_TEMPLATE]
