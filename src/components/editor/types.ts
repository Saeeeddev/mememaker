export interface MemeTemplate {
  id: string
  name: string
  url: string
}

export interface TextEditState {
  text: string
  fontFamily: string
  fontSize: number
  textColor: string
  strokeColor: string
}

export type EditorStep = 'pick' | 'edit'

export const FONTS = [
  { value: 'Impact', label: 'Impact (Classic)' },
  { value: 'Lalezar', label: 'Lalezar (Bold FA)' },
  { value: 'Vazirmatn', label: 'Vazirmatn (Readable)' },
  { value: 'Poppins', label: 'Poppins (Modern)' },
]

export const BOT_TOKEN = '8482663049:AAE9Mt6bLJQ4_SS5P36PvY3RblbkpOdB-mU'

export const BLANK_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
