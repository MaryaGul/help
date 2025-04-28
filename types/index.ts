export type FontWeight = "normal" | "bold" | "light" | "medium" | "semibold"
export type FontStyle = "normal" | "italic"
export type TextAlign = "left" | "center" | "right"

export type TextElement = {
  id: string
  type: "text"
  content: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  fontWeight: FontWeight
  fontStyle: FontStyle
  color: string
  textAlign: TextAlign
  width?: number
}

export type ListElement = {
  id: string
  type: "list"
  items: {
    id: string
    content: string
    icon?: string
  }[]
  x: number
  y: number
  fontSize: number
  fontFamily: string
  fontWeight: FontWeight
  fontStyle: FontStyle
  color: string
  iconColor: string
  spacing: number
  width?: number
}

export type ImageElement = {
  id: string
  type: "image"
  src: string
  x: number
  y: number
  width: number
  height: number
}

export type IconElement = {
  id: string
  type: "icon"
  icon: string
  x: number
  y: number
  size: number
  color: string
}

export type CardElement = TextElement | ListElement | ImageElement | IconElement

export type Template = {
  id: string
  name: string
  width: number
  height: number
  backgroundColor: string
  backgroundImage?: string
  elements: CardElement[]
}

export type CardData = {
  template: Template
  backgroundColor: string
  backgroundImage: string | null
  elements: CardElement[]
}
